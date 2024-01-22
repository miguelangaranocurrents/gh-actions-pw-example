import { bgYellow } from "colors/safe";
import Debug from "debug";
import fs from "fs";
import os from "os";
import path from "path";
import utils from "util";
import { getRandomString } from "../lib/nano";
import { dim, info, warn, white } from "../logger";

const original = Debug.log;

const debug = Debug("currents:remote-debug");

const pipelines: Record<
  string,
  {
    type: "cli" | "core";
    id: string;
    writeStream: fs.WriteStream;
    tempFilePath: string;
  }
> = {};

function shouldEnableRemoteDebug(mode: boolean | "remote" | "full") {
  if (mode === "full" || mode === "remote") {
    return true;
  }

  return false;
}

function shouldMuteLocalStdout(mode: boolean | "remote" | "full") {
  if (mode === "remote") {
    return true;
  }

  return false;
}

export function initDebug(
  params: {
    source: "cli" | "core";
    mode: boolean | "remote" | "full";
  } = {
    source: "core",
    mode: "remote",
  }
) {
  if (params.mode !== false) {
    const debugPattern = process.env.DEBUG
      ? `${process.env.DEBUG},currents*`
      : "currents*";
    Debug.enable(debugPattern);
  }
  if (!shouldEnableRemoteDebug(params.mode)) {
    return;
  }
  const id = getRandomString();
  const tempFilePath = path.resolve(os.tmpdir(), `currents-debug_${id}.log`);
  info(
    white(
      bgYellow(`👾 Initiated remote ${params.source} debug log collection:`)
    ),
    dim(tempFilePath)
  );

  const writeStream = fs.createWriteStream(tempFilePath, { flags: "a" });

  Debug.log = (...args) => {
    writeStream.write(`${utils.format(...args)}\n`);
    if (!shouldMuteLocalStdout(params.mode)) {
      original(...args);
    }
  };

  pipelines[id] = {
    id,
    writeStream,
    type: params.source,
    tempFilePath,
  };

  return id;
}

export async function finalizeDebug({ runId }: { runId?: string }) {
  try {
    const ids = Object.keys(pipelines);

    if (ids.length === 0) {
      debug(`No debug pipelines found`);
      Debug.log = original;
    }

    for (const id of ids) {
      await uploadDebug(id, runId ?? getRandomString());
    }
  } finally {
    Debug.log = original;
  }
}

async function uploadDebug(id: string, runId: string) {
  const pipeline = pipelines[id];

  if (!pipeline) {
    debug(`No debug pipeline found for id %s`, id);
    return;
  }

  info(
    white(bgYellow(`👾 ${pipeline.type} debug log written:`)),
    dim(pipeline?.tempFilePath)
  );

  const { getDebugUrl } = await import("./api");
  try {
    const { readUrl, uploadUrl } = await getDebugUrl({
      runId,
      type: "pw-debug",
    });
    const { uploadText } = await import("../upload");
    await uploadText(pipeline.tempFilePath, uploadUrl);
    pipeline?.writeStream.end();
    info(
      white(bgYellow(`👾 ${pipeline.type} debug log uploaded:`)),
      dim(readUrl)
    );
  } catch (e) {
    warn(
      `Failed to upload ${pipeline.type}} debug log ${dim(
        pipeline.tempFilePath
      )}: ${(e as Error).message}`
    );
  }
}

export { Debug };
