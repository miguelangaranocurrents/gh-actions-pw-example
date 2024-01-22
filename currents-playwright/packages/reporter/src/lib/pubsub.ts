import EventEmitter from "events";
import * as logger from "../logger";
import { getCancellationReason } from "./cancellation";

export enum Event {
  RUN_CANCELLED = "runCancelled",
}
export const pubsub = new EventEmitter();

export function addEventListeners() {
  pubsub.addListener(Event.RUN_CANCELLED, onRunCancelled);
}

export function removeEventListeners() {
  pubsub.removeListener(Event.RUN_CANCELLED, onRunCancelled);
}

function onRunCancelled() {
  logger.debug("Run cancelled: %s", getCancellationReason());
  process.exit(1);
}
