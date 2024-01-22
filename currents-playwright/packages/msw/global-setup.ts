import { server } from "@currents/msw";

export default function globalSetup() {
  console.log("*** MSW global setup");
  server.listen();
}
