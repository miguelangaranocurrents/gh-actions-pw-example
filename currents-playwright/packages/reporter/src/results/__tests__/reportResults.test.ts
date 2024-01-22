import { reportResults } from "../results";
import { testCases } from "./fixtures/sendResultsForSpecParams";
import {
  cancellationInstanceId,
  screenshotId,
  traceId,
  server,
  videoId,
  withoutVideoAssets,
  withoutTraceUrls,
} from "./msw";
import * as screenshots from "../screenshots";
import * as traces from "../traces";
import * as upload from "../upload";
import * as videos from "../videos";
import * as instances from "../../instances";
import * as cancellation from "../../lib/cancellation";
import { getAttachmentsFromTestCases } from "../tests";
import { VideoAttachment } from "../types";

jest.mock("../screenshots", () => ({
  __esModule: true,
  ...jest.requireActual("../screenshots"),
}));
jest.mock("../traces", () => ({
  __esModule: true,
  ...jest.requireActual("../traces"),
}));
jest.mock("../upload", () => ({
  __esModule: true,
  ...jest.requireActual("../upload"),
}));
jest.mock("../videos", () => ({
  __esModule: true,
  ...jest.requireActual("../videos"),
}));
jest.mock("../../instances", () => ({
  __esModule: true,
  ...jest.requireActual("../../instances"),
}));
jest.mock("../../lib/cancellation", () => ({
  __esModule: true,
  ...jest.requireActual("../../lib/cancellation"),
}));

let getInstanceUploadTaskSpy: jest.SpyInstance;

const instanceId = "3p2gEayXQ2WY";

const testCases_ = testCases.map((t, i) => ({
  ...t,
  clientId: i.toString(),
}));

describe("reportResults", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    getInstanceUploadTaskSpy = jest
      .spyOn(upload, "getInstanceUploadTask")
      .mockReturnValue(Promise.resolve([]));
  });

  it("should set cancellation reason and upload the artifacts", async () => {
    const setCancellationReasonSpy = jest.spyOn(
      cancellation,
      "setCancellationReason"
    );
    await reportResults({
      instanceId: cancellationInstanceId,
      testCases: testCases_,
      stdout: "",
    });
    expect(setCancellationReasonSpy).toHaveBeenCalled();
    expect(getInstanceUploadTaskSpy).toHaveBeenCalled();
  });

  it("should remove large data from payload by redacting the body buffer", async () => {
    jest
      .spyOn(upload, "getInstanceUploadTask")
      .mockReturnValue(Promise.resolve([]));
    const sendInstanceResultsRequestSpy = jest.spyOn(
      instances,
      "sendInstanceResultsRequest"
    );

    await reportResults({
      instanceId,
      testCases: testCases_.map((t, i) => ({
        ...t,
        results: t.results.map((r) => ({
          ...r,
          attachments: r.attachments.map((a) => ({
            ...a,
            body: Buffer.from("attachment"),
          })),
        })),
      })),
      stdout: "",
    });

    expect(sendInstanceResultsRequestSpy).toHaveBeenCalledWith({
      instanceId,
      tests: expect.any(Object),
      resultsBody: expect.objectContaining({
        videos: expect.arrayContaining([
          expect.objectContaining({
            body: Buffer.from("redacted"),
          }),
        ]),
      }),
    });
  });

  it("should handle the screenshot [path upload]", async () => {
    const screenshot = getAttachmentsFromTestCases(testCases_)[0];
    jest.spyOn(screenshots, "getScreenshots").mockReturnValue([
      {
        screenshotId,
        name: screenshot.name,
        testId: screenshot.testId,
        testAttemptIndex: screenshot.testAttemptIndex,
        path: screenshot.path as string,
        height: 0,
        width: 0,
        takenAt: new Date(),
      },
    ]);

    await reportResults({
      instanceId,
      testCases: testCases_,
      stdout: "",
    });

    expect(getInstanceUploadTaskSpy).toHaveBeenCalledWith({
      instanceId,
      uploads: expect.arrayContaining([
        expect.objectContaining({
          name: screenshot.name,
          path: expect.any(String),
        }),
      ]),
    });
  });

  it("should handle the screenshot [buffer upload]", async () => {
    const screenshot = getAttachmentsFromTestCases(testCases_)[0];
    jest.spyOn(screenshots, "getScreenshots").mockReturnValue([
      {
        screenshotId,
        name: screenshot.name,
        testId: screenshot.testId,
        testAttemptIndex: screenshot.testAttemptIndex,
        body: Buffer.from("buffer"),
        height: 0,
        width: 0,
        takenAt: new Date(),
      },
    ]);

    await reportResults({
      instanceId,
      testCases: testCases_,
      stdout: "",
    });

    expect(getInstanceUploadTaskSpy).toHaveBeenCalledWith({
      instanceId,
      uploads: expect.arrayContaining([
        expect.objectContaining({
          name: screenshot.name,
          buffer: expect.any(Buffer),
        }),
      ]),
    });
  });

  it("should handle the trace uploads", async () => {
    const trace = getAttachmentsFromTestCases(testCases_)[0];
    jest.spyOn(traces, "getTraceFiles").mockReturnValue([
      {
        traceId,
        name: trace.name,
        testId: trace.testId,
        testAttemptIndex: trace.testAttemptIndex,
        path: trace.path as string,
        takenAt: new Date(),
      },
    ]);

    await reportResults({
      instanceId,
      testCases: testCases_,
      stdout: "",
    });

    expect(getInstanceUploadTaskSpy).toHaveBeenCalledWith({
      instanceId,
      uploads: expect.arrayContaining([
        expect.objectContaining({
          name: trace.name,
          path: expect.any(String),
        }),
      ]),
    });
  });

  it("should handle the large raw data", async () => {
    const sendInstanceResultsRequestSpy = jest.spyOn(
      instances,
      "sendInstanceResultsRequest"
    );
    await reportResults({
      instanceId,
      testCases: testCases_.map((t) => ({
        ...t,
        title: Buffer.alloc(1024 * 1024).toString(),
      })),
      stdout: "",
    });
    expect(sendInstanceResultsRequestSpy).toHaveBeenCalledWith({
      instanceId,
      tests: expect.any(Object),
      resultsBody: expect.objectContaining({
        raw: "toobig",
      }),
    });
  });

  it("should create a buffer from the provided stdout", async () => {
    await reportResults({
      instanceId,
      testCases: testCases_,
      stdout: "stdout",
    });
    expect(getInstanceUploadTaskSpy).toHaveBeenCalledWith({
      instanceId,
      uploads: expect.arrayContaining([
        expect.objectContaining({
          name: "stdout",
          buffer: Buffer.from("stdout"),
        }),
      ]),
    });
  });

  it("should use the local video if exists", async () => {
    const video = getAttachmentsFromTestCases(testCases_)[0];
    jest.spyOn(videos, "getVideoAttachments").mockReturnValue([
      {
        id: videoId,
        name: video.name,
        testId: video.testId,
        testAttemptIndex: video.testAttemptIndex,
        path: video.path as string,
        contentType: "video",
        body: Buffer.from("video"),
      },
    ]);

    await reportResults({
      instanceId,
      testCases: testCases_,
      stdout: "",
    });

    expect(getInstanceUploadTaskSpy).toHaveBeenCalledWith({
      instanceId,
      uploads: expect.arrayContaining([
        expect.objectContaining({
          name: video.name,
          path: video.path,
          body: Buffer.from("video"),
        }),
      ]),
    });
  });

  it("should use the fallback values for video uploads", async () => {
    jest.spyOn(videos, "getVideoAttachments").mockReturnValue([
      {
        id: withoutVideoAssets,
      },
    ] as VideoAttachment[]);

    await reportResults({
      instanceId: withoutVideoAssets,
      testCases: testCases_,
      stdout: "",
    });

    expect(getInstanceUploadTaskSpy).toHaveBeenCalledWith({
      instanceId: withoutVideoAssets,
      uploads: expect.arrayContaining([
        expect.objectContaining({
          name: null,
          path: undefined,
          body: undefined,
        }),
      ]),
    });
  });

  it("should handle the results without traces", async () => {
    const trace = getAttachmentsFromTestCases(testCases_)[0];
    jest.spyOn(traces, "getTraceFiles").mockReturnValue([
      {
        traceId,
        name: trace.name,
        testId: trace.testId,
        testAttemptIndex: trace.testAttemptIndex,
        path: trace.path as string,
        takenAt: new Date(),
      },
    ]);

    await reportResults({
      instanceId: withoutTraceUrls,
      testCases: testCases_,
      stdout: "",
    });

    expect(getInstanceUploadTaskSpy).toHaveBeenCalledWith({
      instanceId: withoutTraceUrls,
      uploads: expect.arrayContaining([
        expect.not.objectContaining({
          name: trace.name,
        }),
      ]),
    });
  });
});
