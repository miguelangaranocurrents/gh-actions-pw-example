import { http, HttpResponse } from "msw";
import { sendIPCMessage } from "./ipc";

function getBaseUrl() {
  return "https://cy.currents.dev";
}

const createRun = http.post(`${getBaseUrl()}/runs`, async ({ request }) => {
  await sendIPCMessage({
    type: "createRun",
    payload: await request.json(),
  });

  return HttpResponse.json({
    runId: "runId",
    machineId: "machineId",
    runUrl: "https://example.com/runs/runId",
  });
});

const createInstance = http.post(
  `${getBaseUrl()}/runs/:runId/pw/instances`,
  async ({ request }) => {
    await sendIPCMessage({
      type: "createInstance",
      payload: await request.json(),
    });

    return HttpResponse.json({
      instanceId: "instanceId",
      claimedCount: 1,
    });
  }
);

export const postInstanceResults = http.post(
  `${getBaseUrl()}/instances/:instanceId/pw/results`,
  async ({ request }) => {
    await sendIPCMessage({
      type: "postInstanceResults",
      payload: await request.json(),
    });

    return HttpResponse.json({
      stdoutUploadUrl: null,
    });
  }
);

export const handlers = [
  createRun,
  createInstance,
  postInstanceResults,
] as const;
