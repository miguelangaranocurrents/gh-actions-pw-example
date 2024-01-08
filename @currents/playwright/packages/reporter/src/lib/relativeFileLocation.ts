import type { Location } from "@playwright/test/reporter";
import path from "path";

export function relativeFileLocation(location: Location, rootDir: string) {
  return toPosixPath(path.relative(rootDir, location.file));
}

function toPosixPath(aPath: string): string {
  return aPath.split(path.sep).join(path.posix.sep);
}
