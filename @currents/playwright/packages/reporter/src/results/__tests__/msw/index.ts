import { rest } from "msw";
import * as path from "path";
import { setupServer } from "msw/node";
import { UpdateInstanceResultsResponse } from "../../../instances";
import { getAPIBaseUrl } from "../../../http/httpConfig";
import { match } from "ts-pattern";

export const videoId = "videoId";
export const screenshotId = "screenshotId";
export const traceId = "traceId";

const uploadUrl = "http://localhost:1234/example";
const updateInstanceResultsResponse: UpdateInstanceResultsResponse = {
  videoUploadUrl: uploadUrl,
  stdoutUploadUrl: uploadUrl,
  screenshotUploadUrls: [
    {
      readUrl: "readUrl",
      uploadUrl: uploadUrl,
      screenshotId,
    },
  ],
  playwrightTraceUrls: [
    {
      readUrl: "readUrl",
      uploadUrl: uploadUrl,
      traceId,
    },
  ],
  videoAssets: [
    {
      name: "videoAssetName",
      path: path.join(__dirname, "../fixtures/file.txt"),
      uploadUrl: uploadUrl,
      id: videoId,
    },
  ],
};
export const cancellationReason = "Cancellation reason";
export const cancellationInstanceId = "cancellationInstanceId";
export const withoutVideoAssets = "withoutVideoAssets";
export const withoutTraceUrls = "withoutTraceUrls";

export const server = setupServer(
  rest.post(
    `${getAPIBaseUrl()}/instances/:instanceId/pw/results`,
    (req, res, ctx) => {
      return res(
        ctx.json(
          match(req.params.instanceId)
            .with(cancellationInstanceId, () => ({
              ...updateInstanceResultsResponse,
              cloud: {
                shouldCancel: cancellationReason,
              },
            }))
            .with(withoutVideoAssets, () => ({
              ...updateInstanceResultsResponse,
              videoAssets: [
                {
                  id: videoId,
                },
              ],
            }))
            .with(withoutTraceUrls, () => ({
              ...updateInstanceResultsResponse,
              playwrightTraceUrls: undefined,
            }))
            .otherwise(() => updateInstanceResultsResponse)
        )
      );
    }
  ),
  rest.put(uploadUrl, (req, res, ctx) => {
    return res(ctx.json({}));
  })
);
