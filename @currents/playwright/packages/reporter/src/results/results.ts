import stringify from "json-stringify-safe";
import { omit } from "lodash";
import { P, match } from "ts-pattern";
import { debug } from "../debug";
import {
  UploadInstructionsResponsePayload,
  sendInstanceResultsRequest,
} from "../instances";
import { setCancellationReason } from "../lib/cancellation";
import { isNonNullable } from "../lib/lang";
import { ContentType } from "../upload";
import { getRawTestCase } from "./raw";
import { getScreenshots } from "./screenshots";
import { getReporterStatsFromStats, getStatsFromTests } from "./stats";
import { playwrightTestSuiteToTest } from "./testCase";
import { getTests } from "./tests";
import { getTraceFiles } from "./traces";
import {
  InstanceResults,
  ScreenshotWithBody,
  ScreenshotWithPath,
  TestCaseWithClientId,
} from "./types";
import { Upload, getInstanceUploadTask } from "./upload";
import { getVideoAttachments, getVideoInformation } from "./videos";
export async function reportResults({
  instanceId,
  testCases,
  stdout,
}: {
  instanceId: string;
  testCases: TestCaseWithClientId[];
  stdout: string;
}) {
  const instanceResults = getInstanceResults(testCases);

  // get reduced payload, otherwise we get faulty responses from the server
  const instanceResultsPayload = getInstanceResultsPayload(instanceResults);
  debug(
    "Results for instance %s: %o",
    instanceId,
    omit(instanceResultsPayload, "raw")
  );
  const { cloud, ...uploadInstructions } = await sendInstanceResultsRequest({
    instanceId,
    tests: getTests(testCases),
    resultsBody: instanceResultsPayload,
  });

  if (cloud?.shouldCancel) {
    debug("instance %s should cancel", instanceId);
    setCancellationReason(cloud.shouldCancel);
  }

  const uploads = [
    ...getVideoUploads({
      videos: instanceResults.videos,
      videoAssets: uploadInstructions.videoAssets,
    }),
    ...getScreenshotUploads({
      screenshots: instanceResults.screenshots,
      screenshotUploadUrls: uploadInstructions.screenshotUploadUrls,
    }),
    ...getTraceUploads({
      playwrightTraces: instanceResults.playwrightTraces,
      playwrightTraceUrls: uploadInstructions.playwrightTraceUrls,
    }),
    {
      name: "stdout",
      buffer: Buffer.from(stdout.length ? stdout : getEmptyStdout(testCases)),
      uploadUrl: uploadInstructions.stdoutUploadUrl,
      contentType: ContentType.TEXT,
    },
  ];
  return getInstanceUploadTask({
    instanceId,
    uploads: uploads.filter(isNonNullable),
  });
}

function getInstanceResultsPayload(results: InstanceResults) {
  // remove large data from the payload
  return {
    ...results,
    videos: results.videos.map(redactBodyBuffer),
    screenshots: results.screenshots.map(redactBodyBuffer),
  };
}

function redactBodyBuffer<T extends { body?: Buffer; path?: string }>(s: T) {
  if (!s.body) return s;
  return {
    ...s,
    body: Buffer.from("redacted"),
  };
}

function getEmptyStdout(testCases: TestCaseWithClientId[]) {
  return `No console output was generated during execution of the tests:
${testCases
  .map((testCase) => `- ${testCase.location.file}: ${testCase.title}`)
  .join("\n")}`;
}

function getVideoUploads({
  videos,
  videoAssets,
}: {
  videos: InstanceResults["videos"];
  videoAssets: UploadInstructionsResponsePayload["videoAssets"];
}): Upload[] {
  return videoAssets.map((videoAsset) => {
    const localVideo = videos.find((v) => v.id === videoAsset.id);
    return {
      ...videoAsset,
      name: localVideo?.name ?? videoAsset.name ?? null,
      path: localVideo?.path ?? videoAsset.path ?? undefined,
      body: localVideo?.body,
      contentType: ContentType.WEBM,
    };
  });
}

function getScreenshotUploads({
  screenshots,
  screenshotUploadUrls,
}: {
  screenshots: Array<ScreenshotWithPath | ScreenshotWithBody>;
  screenshotUploadUrls: UploadInstructionsResponsePayload["screenshotUploadUrls"];
}): Array<Upload> {
  return screenshotUploadUrls
    .map((s) => {
      const found = screenshots.find(
        (screenshot) => screenshot.screenshotId === s.screenshotId
      );

      if (!found) {
        return undefined;
      }

      return match(found)
        .with({ path: P.string }, (i) => ({
          name: i.name,
          path: i.path,
          uploadUrl: s.uploadUrl,
          contentType: ContentType.PNG,
        }))
        .with({ body: P.instanceOf(Buffer) }, (i) => ({
          name: i.name,
          buffer: i.body,
          uploadUrl: s.uploadUrl,
          contentType: ContentType.PNG,
        }))
        .exhaustive();
    })
    .filter(isNonNullable);
}

function getTraceUploads({
  playwrightTraces,
  playwrightTraceUrls = [],
}: {
  playwrightTraces: ReturnType<typeof getTraceFiles>;
  playwrightTraceUrls: UploadInstructionsResponsePayload["playwrightTraceUrls"];
}): Array<Upload | undefined> {
  return playwrightTraceUrls.map((pt) => {
    const found = playwrightTraces.find(
      (trace) => trace.traceId === pt.traceId
    );
    if (!found?.path) return undefined;

    return {
      name: found.name,
      path: found.path,
      uploadUrl: pt.uploadUrl,
      contentType: ContentType.ZIP,
    };
  });
}
function getInstanceResults(
  testCases: TestCaseWithClientId[]
): InstanceResults {
  const stats = getStatsFromTests(testCases);
  const reporterStats = getReporterStatsFromStats(stats);
  const videoInfo = getVideoInformation(testCases);
  const videos = getVideoAttachments(testCases);
  const screenshots = getScreenshots(testCases);
  const playwrightTraces = getTraceFiles(testCases);

  return {
    stats,
    reporterStats,
    video: videoInfo.type === "hasVideo",
    videos,
    screenshots,
    playwrightTraces,
    exception: null,
    tests: playwrightTestSuiteToTest(testCases),
    raw: getRaw(testCases),
  };
}

const getRaw = (testCases: TestCaseWithClientId[]) =>
  match(stringify(testCases.map(getRawTestCase)))
    .when(
      (s) => stringSizeInMB(s) < 5,
      (s) => s
    )
    .otherwise(() => "toobig");

function stringSizeInMB(s: string) {
  const bytes = Buffer.byteLength(s, "utf8");
  const megabytes = bytes / (1024 * 1024);
  return megabytes;
}
