import { beforeEach, describe, expect, it } from "@jest/globals";
import { ValidationError } from "../../lib/error";
import { getCurrentsConfig, setCurrentsConfig } from "../config";
import * as options from "../options";

jest.mock("../options");

const config = {
  ciBuildId: "ciBuildId",
  projectId: "projectId",
  recordKey: "recordKey",
  enableTestResults: false,
  tag: ["tag"],
};

describe("config", () => {
  beforeEach(() => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    delete process.env["CURRENTS_CI_BUILD_ID"];
    delete process.env["CURRENTS_TAG"];

    jest.spyOn(options, "getCLIOptions").mockReturnValue({});
  });

  it("should throw ValidationError", () => {
    expect(() => setCurrentsConfig({})).toThrowError(ValidationError);
  });

  it("should set valid configuration", () => {
    setCurrentsConfig(config);
    expect(getCurrentsConfig()).toEqual(config);
  });

  it("should prefer process.env", () => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.CURRENTS_CI_BUILD_ID = "ciBuildId_process.env";

    setCurrentsConfig(config);
    expect(getCurrentsConfig()).toEqual({
      ...config,
      ciBuildId: "ciBuildId_process.env",
    });
  });

  it("should prefer CLI options", () => {
    jest.spyOn(options, "getCLIOptions").mockReturnValue({
      recordKey: "recordKey_cli",
    });
    setCurrentsConfig(config);
    expect(getCurrentsConfig()).toEqual({
      ...config,
      recordKey: "recordKey_cli",
    });
  });

  it("should deserialize tags from env", () => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.CURRENTS_TAG = "a,b,c";
    setCurrentsConfig(config);
    expect(getCurrentsConfig()).toEqual({
      ...config,
      tag: ["a", "b", "c"],
    });
  });
});
