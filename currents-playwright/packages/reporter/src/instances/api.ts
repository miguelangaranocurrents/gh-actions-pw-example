import { debug } from "../debug";
import { makeRequest } from "../http";
import { InstanceResults, WorkerInfo, getTests } from "../results";
export interface UploadInstructionsResponsePayload {
  videoUploadUrl: string | null;
  stdoutUploadUrl: string;
  screenshotUploadUrls: {
    readUrl: string;
    uploadUrl: string;
    screenshotId: string;
  }[];
  playwrightTraceUrls?: {
    readUrl: string;
    uploadUrl: string;
    traceId: string;
  }[];
  videoAssets: {
    name: string;
    path: string;
    uploadUrl: string;
    id: string;
  }[];
}

export interface UpdateInstanceResultsResponse
  extends UploadInstructionsResponsePayload {
  cloud?: {
    shouldCancel: false | string;
  };
}

export function sendInstanceResultsRequest({
  instanceId,
  tests,
  resultsBody,
}: {
  resultsBody: InstanceResults;
  tests: ReturnType<typeof getTests>;
  instanceId: string;
}) {
  return makeRequest<UpdateInstanceResultsResponse, InstanceResults>({
    method: "POST",
    url: `instances/${instanceId}/pw/results`,
    data: {
      results: resultsBody,
      tests,
    },
  }).then((r) => r.data);
}

type InstancesFromRunParams = {
  runId: string;
  groupId: string;
  machineId: string;
  spec: string;
  worker: WorkerInfo;
};
export type CreateInstanceResponsePayload = {
  instanceId: string;
  claimedCount: number;
};
export function sendCreateInstanceRequest({
  runId,
  groupId,
  machineId,
  worker,
  spec,
}: InstancesFromRunParams) {
  debug("Creating instance: %o", {
    runId,
    groupId,
    machineId,
    worker,
    spec,
  });
  return makeRequest<CreateInstanceResponsePayload>({
    method: "POST",
    url: `runs/${runId}/pw/instances`,
    data: {
      spec,
      runId,
      groupId,
      machineId,
      worker,
    },
  }).then((r) => r.data);
}
