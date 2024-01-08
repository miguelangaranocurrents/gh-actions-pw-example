import path from "path";
import config from "./playwright.config";

export default {
  ...config,
  testDir: path.join(__dirname, "e2e_crash"),
};
