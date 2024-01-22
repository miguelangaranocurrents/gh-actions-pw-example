import { expect, it, jest } from "@jest/globals";
import axios from "axios";
import { expectedRunResult as basic } from "../basic/expectedRunResult";

it("Has sent the correct information to Currents", async () => {
  jest.setTimeout(10000);
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const runUrl = process.env.CURRENTS_RUN_URL;
  expect(runUrl).toBeDefined();
  if (!runUrl) {
    throw new Error("No CURRENTS_RUN_URL env variable defined");
  }

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const apiToken = process.env.CURRENTS_API_TOKEN;
  if (!apiToken) {
    throw new Error("CURRENTS_API_TOKEN not found");
  }
  const runId = getRunId(runUrl);
  const runInfo = await getRunInfo(runId, apiToken);

  expect({
    ...runInfo,
    tags: runInfo.tags.sort(),
  }).toMatchObject(basic);
});

function getRunId(cloudRunUrl: string) {
  return cloudRunUrl.replace("https://app.currents.dev/run/", "");
}

async function getRunInfo(runId: string, apiToken: string) {
  const runs = await axios.get(`https://api.currents.dev/v1/runs/${runId}`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });
  return runs.data.data;
}
