// This file needs to only export as default, the parallel reporter
// It's exported as part of the package, then accessed when running the parallel bin script

import { DefaultReporter } from "../reporters";
export default DefaultReporter;
