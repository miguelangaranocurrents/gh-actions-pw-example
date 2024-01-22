import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export * as ipc from "./ipc";

export const server = setupServer(...handlers);
