#! /usr/bin/env node
import "source-map-support/register";

import Debug from "debug";
import fs from "fs";
import { pwcScanner } from "..";
import { args, getValidatedArgs } from "../args";

const debug = Debug("pwc-scanner:cli");

(async function runScript() {
  const { outFile, project, grep, grepInvert, config } = getValidatedArgs();

  debug("cli args: %o", args);

  const { result, execaResult } = await pwcScanner({
    project,
    grep: grep ?? null,
    grepInvert: grepInvert ?? null,
    config,
  });

  process.stdout.write(execaResult.stdout + "\n");

  debug("result: %o", result);

  if (result) {
    fs.writeFileSync(outFile, JSON.stringify(result));
    debug("result was written to: %s", outFile);
  }

  process.exit(execaResult.exitCode);
})();
