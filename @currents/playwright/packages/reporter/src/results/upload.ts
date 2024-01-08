import { AxiosProgressEvent } from "axios";
import { pick } from "lodash";
import pall from "p-all";
import { P, match } from "ts-pattern";
import { format } from "util";
import { debug as _debug } from "../debug";
import { warn } from "../logger";
import { ContentType, sendBuffer, sendPath } from "../upload/";

const debug = _debug.extend("upload");

// const multibar = new cliProgress.MultiBar({
//   format:
//     `{path} ` +
//     colors.cyan("{bar}") +
//     " {value}/{total} files | {loadedBytes}/{totalBytes}",
//   barCompleteChar: "\u2588",
//   barIncompleteChar: "\u2591",
//   hideCursor: true,
// });
// const bars: Record<string, typeof cliProgress.MultiBar> = {};

export const uploadWarnings = new Set<string>();

// export const getInstanceUploadTaskWithProgress = ({
//   instanceId,
//   uploads,
// }: {
//   instanceId: string;
//   uploads: Upload[];
// }) => {
//   // bars[instanceId] = multibar.create(uploads.length, 0, {
//   //   instanceId,
//   // });

//   return pall(
//     uploads.map((path) => async () => {
//       // bars[path.path] = multibar.create(uploads.length, 0, {
//       //   path: `${path.name} + ${path.path}`,
//       // });
//       if (!uploadTasks.has(instanceId)) {
//         uploadTasks.set(instanceId, {
//           overall: uploads.length,
//           started: 0,
//           completed: 0,
//         });
//       }

//       const progress = uploadTasks.get(instanceId)!;
//       progress.started += 1;

//       try {
//         await send(path, (progressEvent) => {
//           // bars[path.name].update({
//           //   path: path.name,
//           //   loadedBytes: progressEvent.loaded / (1000 * 1000),
//           //   totalBytes: (progressEvent.total ?? 0) / (1000 * 1000),
//           // });
//         });
//       } catch (e) {
//         const msg = format(
//           "Upload failed: %o",
//           formatAxiosError(e),
//           getUploadPath(path)
//         );
//         uploadWarnings.add(msg);
//         warn(msg);
//       }
//       // bars[instanceId].increment({ instanceId });

//       // if (progress.completed === progress.overall) {
//       //   bars[instanceId].stop();
//       // }
//       progress.completed += 1;
//       debug("Upload task %s: %o", instanceId, {
//         overall: progress.overall,
//         started: progress.started,
//         completed: progress.completed,
//       });
//     }),
//     {
//       concurrency: 1,
//       stopOnError: false,
//     }
//   );
// };

const getUploadUpdateHandler =
  (label: string) =>
  ({ total, loaded }: AxiosProgressEvent) => {
    () => {
      debug(
        "Uploading %s: %d / %d",
        label,
        bytesToMb(loaded),
        bytesToMb(total ?? 0)
      );
    };
  };
export const getInstanceUploadTask = ({
  instanceId,
  uploads,
}: {
  instanceId: string;
  uploads: Upload[];
}) => {
  return pall(
    uploads.map((upload) => async () => {
      try {
        await match(upload)
          .with({ path: P.string }, async (u) => {
            await sendPath(u, u.contentType, getUploadUpdateHandler(u.path));
            debug("Upload completed for %s, %s", instanceId, u.path);
          })
          .with({ buffer: P.any }, async (u) => {
            await sendBuffer(
              u,
              u.contentType,
              getUploadUpdateHandler(u.name ?? "buffer")
            );
            debug("Upload completed for %s, %s", instanceId, u.name);
          })
          .exhaustive();
      } catch (e) {
        const msg = format("Upload failed: %o", formatAxiosError(e));
        uploadWarnings.add(msg);
        warn(msg);
      }
    }),
    {
      concurrency: 10,
      stopOnError: false,
    }
  );
};

function formatAxiosError(error: unknown) {
  return pick(error, "message", "code", "method", "url");
}

export type PathUpload = {
  name: string | null;
  path: string;
  uploadUrl: string;
  contentType: ContentType;
};

export type BufferUpload = {
  name: string | null;
  buffer: Buffer;
  uploadUrl: string;
  contentType: ContentType;
};

export type Upload = PathUpload | BufferUpload;

function bytesToMb(bytes: number) {
  return bytes / 1000 / 1000;
}
