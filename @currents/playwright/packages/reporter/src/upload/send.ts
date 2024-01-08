import retry from "async-retry";
import axios, { RawAxiosRequestConfig } from "axios";
import fs from "fs/promises";
import { debug as _debug } from "../debug";
import { error as logError, warn } from "../logger";
import { BufferUpload, PathUpload } from "../results/upload";

const debug = _debug.extend("upload");

export enum ContentType {
  PNG = "image/png",
  WEBM = "video/webm",
  TEXT = "text/plain",
  ZIP = "application/zip",
}

export function uploadText(file: string, url: string) {
  return sendPath(
    {
      path: file,
      name: null,
      uploadUrl: url,
      contentType: ContentType.TEXT,
    },
    ContentType.TEXT,
    undefined
  );
}

export async function sendPath(
  upload: PathUpload,
  contentType: ContentType,
  onUploadProgress: RawAxiosRequestConfig["onUploadProgress"]
) {
  const buffer = await fs.readFile(upload.path);
  debug("Uploading file %s", upload.uploadUrl, {
    buffer: Buffer.byteLength(buffer),
  });
  return send(buffer, upload.uploadUrl, contentType, onUploadProgress);
}

export async function sendBuffer(
  upload: BufferUpload,
  contentType: ContentType,
  onUploadProgress: RawAxiosRequestConfig["onUploadProgress"]
) {
  debug("Uploading buffer %s", upload.name, {
    buffer: Buffer.byteLength(upload.buffer),
  });
  return send(upload.buffer, upload.uploadUrl, contentType, onUploadProgress);
}

async function _send(
  buffer: Buffer,
  url: string,
  contentType: ContentType,
  onUploadProgress: RawAxiosRequestConfig["onUploadProgress"]
) {
  return axios({
    method: "put",
    url,
    data: buffer,
    onUploadProgress,
    headers: {
      "Content-Disposition": `inline`,
      "Content-Type": contentType,
    },
  });
}

async function send(...args: Parameters<typeof _send>) {
  await retry(
    async () => {
      await _send(...args);
    },
    {
      retries: 5,
      onRetry: (error: Error, retryCount: number) => {
        if (retryCount === 5) {
          logError(`Cannot upload after ${retryCount} times: ${error.message}`);
          return;
        }
        warn(`Upload failed ${retryCount} out of 5 attempts: ${error.message}`);
      },
    }
  );
}
