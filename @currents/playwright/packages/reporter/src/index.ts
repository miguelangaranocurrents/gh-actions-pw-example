import "source-map-support/register";

import { CurrentsConfig } from "./config/config";
import { DefaultReporter } from "./reporters";

export type { CurrentsConfig } from "./config/config";
/**
 * Create {@link https://currents.dev/playwright | Currents Reporter} to be used with playwright test runner
 *
 * @augments CurrentsConfig
 * @param {CurrentsConfig} config - Currents Reporter {@link https://currents.dev/readme/integration-with-playwright/currents-playwright | configuration}
 * @returns {["@currents/playwright", CurrentsConfig]} a tuple of reporter name and config
 */
export const currentsReporter = (config: CurrentsConfig) =>
  ["@currents/playwright" as string, config] as [string, CurrentsConfig];

export default DefaultReporter;
