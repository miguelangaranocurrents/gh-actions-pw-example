import { ipc } from "@currents/msw";
import { expect, test } from "@playwright/test";

import { runPW } from "../utils";

test("run", async () => {
  ipc.startIPCServer();
  const processResults = await runPW();

  expect(processResults.all).toContain("1 failed");
  expect(processResults.all).toContain("1 did not run");
  expect(processResults.all).toContain("Playwright did not run 2 tests");

  const results = ipc.messages.postInstanceResults?.[0]?.payload;
  expect(results).toBeDefined();

  const testA = results?.results?.tests.find((t) => t.title.includes("test A"));
  const testB = results?.results?.tests.find((t) => t.title.includes("test B"));

  expect(testA).toBeDefined();
  expect(testA?.attempts).toHaveLength(2);
  expect(testA?.attempts[0].state).toBe("failed");
  expect(testA?.attempts[1].state).toBe("pending");
  expect(testA?.attempts[0].error).toMatchObject({
    name: "Error",
    message: expect.stringContaining("expect(received).toBe(expected)"),
  });
  expect(testA?.attempts[1].error).toMatchObject({
    name: "Error",
    message: expect.stringContaining("Playwright did not run this test"),
  });

  expect(testB).toBeDefined();
  expect(testB?.attempts).toHaveLength(2);
  expect(testB?.attempts[0].state).toBe("pending");
  expect(testB?.attempts[1].state).toBe("pending");
  expect(testB?.attempts[0].error).toMatchObject({
    name: "Error",
    message: expect.stringContaining("Playwright did not run this test"),
  });
});
