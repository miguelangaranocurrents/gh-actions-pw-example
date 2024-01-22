import { testCases, config } from "./fixtures/sendResultsForSpecParams";
import { cancellationInstanceId, cancellationReason, server } from "./msw";
import { Event, pubsub } from "../../lib/pubsub";
import { sendResultsForSpec } from "../../testActor";
import * as upload from "../../upload/send";

jest.mock("../../upload/send", () => ({
  __esModule: true,
  ...jest.requireActual("../../upload/send"),
}));

describe("sendResultsForSpec", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it(`should not emit "${Event.RUN_CANCELLED}" event when cancellation reason not is set`, async () => {
    const spy = jest.spyOn(pubsub, "emit");

    await sendResultsForSpec(
      {
        instanceId: "3p2gEayXQ2WY",
        testCases,
        config,
      },
      { status: "failed" }
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it(`should emit "${Event.RUN_CANCELLED}" event when cancellation reason is set`, async () => {
    const pubsubSpy = jest.spyOn(pubsub, "emit");
    const sendPathSpy = jest.spyOn(upload, "sendPath");
    const sendBufferSpy = jest.spyOn(upload, "sendBuffer");

    await sendResultsForSpec(
      {
        instanceId: cancellationInstanceId,
        testCases,
        config,
      },
      { status: "failed" }
    );
    expect(pubsubSpy).toHaveBeenCalledWith(
      Event.RUN_CANCELLED,
      cancellationReason
    );
    expect(sendPathSpy).toHaveBeenCalled();
    expect(sendBufferSpy).toHaveBeenCalled();
    // the last call to th sendPath is before the pubsub emit
    expect(
      sendPathSpy.mock.invocationCallOrder[
        sendPathSpy.mock.invocationCallOrder.length - 1
      ]
    ).toBeLessThan(pubsubSpy.mock.invocationCallOrder[0]);
    // the last call to th sendBuffer is before the pubsub emit
    expect(
      sendBufferSpy.mock.invocationCallOrder[
        sendBufferSpy.mock.invocationCallOrder.length - 1
      ]
    ).toBeLessThan(pubsubSpy.mock.invocationCallOrder[0]);
  });
});
