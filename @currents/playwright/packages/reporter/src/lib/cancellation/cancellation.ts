import { warn } from "../../logger";
import { Event, pubsub } from "../pubsub";

interface ExecutionState {
  cancellationReason: string | null;
}
const state: ExecutionState = {
  cancellationReason: null,
};

export const setCancellationReason = (reason: string) => {
  if (state.cancellationReason) {
    return;
  }
  state.cancellationReason = reason;
};

export const getCancellationReason = () => state.cancellationReason;

export const maybeCancelRun = ({
  showWarning = true,
}: {
  showWarning?: boolean;
} = {}) => {
  const cancellationReason = getCancellationReason();
  if (cancellationReason) {
    showWarning && warn("%s", cancellationReason);
    pubsub.emit(Event.RUN_CANCELLED, cancellationReason);
  }
};
