import { makeRequest } from "../http";

export function sendUploadStdOutRequest({
  instanceId,
  stdout,
}: {
  stdout: string;
  instanceId: string;
}) {
  return makeRequest({
    method: "PUT",
    url: `instances/${instanceId}/pw/stdout`,
    data: { stdout },
  }).then((res) => res.data);
}
