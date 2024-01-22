import arg from "arg";
import { keys } from "./keys";

export const args = arg(
  {
    // Types
    [keys.config]: String,
    [keys.grep]: String,
    [keys.grepInvert]: String,
    [keys.project]: String,
    [keys.outFile]: String,

    // Aliases
    [keys.c]: keys.config,
    [keys.g]: keys.grep,
  },
  { permissive: true }
);
