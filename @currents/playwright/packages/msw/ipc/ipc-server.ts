import ipcModule from "node-ipc";
import { handleMessage } from "./message";

export function startIPCServer(
  onMessage: (msg: string) => void = handleMessage
) {
  const ipc = new ipcModule.IPC();
  ipc.config.id = "server";
  ipc.config.retry = 1500;
  ipc.config.silent = true;

  ipc.serve(() => {
    console.log("*** node-ipc server started");
    ipc.server.on("message", (data: any, socket: any) => {
      onMessage(data);
    });
  });

  ipc.server.start();
}
