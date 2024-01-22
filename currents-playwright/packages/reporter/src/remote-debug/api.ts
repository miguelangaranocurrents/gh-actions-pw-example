import { makeRequest } from "../http";

export const getDebugUrl = ({
  runId,
  type,
}: {
  runId: string;
  type: string;
}) => {
  return makeRequest<
    { uploadUrl: string; readUrl: string },
    { runId: string; type: string }
  >({
    // comment for local
    method: "POST",
    url: `runs/debug-logs`,
    data: {
      type,
      runId,
    },
  }).then((result) => result.data);
};
