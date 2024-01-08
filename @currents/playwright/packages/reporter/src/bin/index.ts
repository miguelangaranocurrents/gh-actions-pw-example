#! /usr/bin/env node
import "source-map-support/register";

import { CommanderError } from "commander";
import fs from "fs";
import { cliOptionsToConfig } from "../config";
import { debug as _debug } from "../debug";
import { getRandomString } from "../lib/nano";
import { error } from "../logger";
import { finalizeDebug, initDebug } from "../remote-debug";
import { getProgram } from "./program";
import { createTempFile } from "./tmp-file";

const debug = _debug.extend("cli");

require("dotenv").config();

async function runScript() {
  const program = getProgram().parse();
  const cliOptions = program.opts();

  if (!!cliOptions.pwcDebug) {
    initDebug({
      source: "cli",
      mode: cliOptions.pwcDebug,
    });
  }

  debug("CLI options: %o", cliOptions);

  const parsedConfig = cliOptionsToConfig(cliOptions);
  debug("Parsed config from CLI options: %o", parsedConfig);

  const tempFilePath = await createTempFile();
  fs.writeFileSync(tempFilePath, JSON.stringify(parsedConfig));

  debug("CLI options temp file path: %s", tempFilePath);

  const { execa } = await import("execa");
  const result = await execa(
    "playwright",
    ["test", "--reporter", "@currents/playwright", ...program.args],
    {
      stdio: "inherit",
      reject: false,
      env: {
        ...process.env,
        CURRENTS_PWC_CONFIG_PATH: tempFilePath,
        ...{ NODE_OPTIONS: cliOptions.pwcInspect ? "--inspect-brk=9440" : "" },
      },
    }
  );
  try {
    await finalizeDebug({ runId: getRandomString() });
  } catch (e) {
    // nooop
  }
  return result;
}

runScript()
  .then((child) => {
    debug("execa result: %o", child);
    process.exit(child.exitCode ?? 0);
  })
  .catch((e) => {
    if (e instanceof CommanderError) {
      error(e.message);
      process.exit(e.exitCode);
    }
    debug("execa failed: %o", e);
    process.exit(1);
  });
