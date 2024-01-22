import ipcModule from "node-ipc";
import { MessageType } from "./message";

let ipc: ipcModule.NPC | null = null;

export function startIPCClient() {
  if (ipc) {
    return;
  }
  ipc = new ipcModule.IPC();

  ipc.config.id = "client";
  ipc.config.retry = 1500;
  ipc.config.silent = true;

  return new Promise((resolve) => {
    ipc.connectTo("server", () => {
      ipc.of.server.on("connect", () => {
        console.log("*** Connected to node-ipc server");
        resolve(null);
      });
    });
  });
}

export async function sendIPCMessage(msg: { type: MessageType; payload: any }) {
  if (!ipc) {
    await startIPCClient();
  }
  if (ipc) {
    return new Promise((resolve) => {
      console.log("*** Sending message to node-ipc server", msg.type);
      ipc.of.server.emit("message", JSON.stringify(msg));
      resolve(null);
    }).catch((e) => {
      console.error(e);
    });
  }

  throw new Error("IPC not initialized");
}
