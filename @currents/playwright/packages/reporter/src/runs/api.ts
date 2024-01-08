import { makeRequest } from "../http";
import { Run } from "./runs";

export function sendCreateRunRequest(payload: unknown) {
  return makeRequest<Run>({
    method: "POST",
    url: `runs`,
    data: payload,
  })
    .then((r) => r.data)
    .catch((e) => {
      if (e.response && e.response.status === 422) {
        return null;
      }
      throw e;
    });
}
