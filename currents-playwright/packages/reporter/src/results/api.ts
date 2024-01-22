import { TestResult } from "@playwright/test/reporter";
import tojson from "json-stringify-safe";
import { makeRequest } from "../http";

export function sendTestResult(params: {
  runId: string;
  groupId: string;
  spec: string;
  reportedAt: string;
  recordKey: string;
  retry: number;
  status: string;
  title: string[];
  result: TestResult;
}) {
  return makeRequest<any, any>({
    method: "POST",
    url: `test-result`,
    data: {
      ...params,
      result: tojson(redactResult(params.result)),
    },
  }).then((r) => r.data);
}

function redactResult(result: TestResult) {
  return {
    ...result,
    attachments: result.attachments.map((a) => ({
      ...a,
      body: a.body ? "redacted" : undefined,
    })),
  };
}
