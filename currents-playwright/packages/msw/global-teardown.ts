import { server } from ".";

export default async function globalTeardown() {
  console.log("*** MSW global teardown");
  server.close();
}
