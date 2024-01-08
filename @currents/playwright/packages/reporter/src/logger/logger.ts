import chalk from "chalk";
import util from "util";

// import { debug } from "../debug";
import { debug } from "../debug";
import { addToLogDrain } from "./logDrain";

const log = (...args: unknown[]) => {
  const stringToRender = util.format(...args);
  addToLogDrain(stringToRender);
  console.log(stringToRender);
};

export const info = log;

export const warn = (...args: unknown[]) => {
  debug("WARNING: ", util.format(...args));
  return log(chalk.bgYellow.black(" WARNING "), util.format(...args));
};

export const success = (...args: unknown[]) =>
  log(chalk.green.bold(util.format(...args)));

export const error = (...args: unknown[]) =>
  log(chalk.bgRed.white(" ERROR "), util.format(...args));

// type Color = "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";
export const title = (...args: unknown[]) =>
  info(chalk.blue.bold(util.format(...args)));

export const divider = () =>
  console.log("\n" + chalk.dim(Array(48).fill("=").join("")) + "\n");

export const spacer = (n: number = 2) =>
  console.log(Array(n).fill("").join("\n"));

export const cyan = chalk.cyan;
export const blue = chalk.blueBright;
export const red = chalk.red;
export const green = chalk.green;
export const gray = chalk.gray;
export const white = chalk.white;
export const magenta = chalk.magenta;
export const dim = chalk.dim;
