import pino from "pino";

const targets = [];

if (process.env.CURRENTS_REMOTE_LOGGING) {
  // placeholder for remote logging
  targets.push({
    level: "debug",
    target: "pino/file",
    options: {
      // destination: file.name,
    },
  });
}
const transport = pino.transport({
  targets,
});

export const remoteLogger = pino(transport);
