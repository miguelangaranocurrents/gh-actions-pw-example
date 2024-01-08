export type MessageType =
  | "postInstanceResults"
  | "createInstance"
  | "createRun";

export interface Message {
  timestamp: number;
  payload: unknown;
}
export const messages: Partial<Record<MessageType, Message[]>> = {};

export function handleMessage(msg: string) {
  const data = JSON.parse(msg) as {
    type: MessageType;
    payload: any;
  };

  if (!Array.isArray(messages[data.type])) {
    messages[data.type] = [];
  }

  messages[data.type]!.push({
    timestamp: Date.now(),
    payload: data.payload,
  });
}
