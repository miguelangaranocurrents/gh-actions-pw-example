import { CommanderError } from "commander";

export function parseDebug(
  value: string | boolean
): boolean | "remote" | "full" {
  if (value === "remote") {
    return "remote";
  }

  if (value === "full") {
    return "full";
  }

  return !!value;
}

export function parseAutoCancelFailures(
  value?: string
): undefined | number | false {
  if (!value) {
    return;
  }

  if (value === "false") {
    return false;
  }

  const parsedValue = parseInt(value, 10);

  if (isNaN(parsedValue) || parsedValue < 1) {
    throw new CommanderError(
      255,
      "Invalid argument provided.",
      "--pwc-cancel-after-failures must be a positive integer or 'false', provided: " +
        value
    );
  }

  return parsedValue;
}
