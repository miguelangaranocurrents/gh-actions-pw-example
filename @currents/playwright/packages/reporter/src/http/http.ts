import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";
import axiosRetry from "axios-retry";
import _ from "lodash";
import prettyMilliseconds from "pretty-ms";
import { P, match } from "ts-pattern";
import { debug as _debug } from "../debug";
import { pwcVersion } from "../env/versions";
import { maybeCancelRun, setCancellationReason } from "../lib/cancellation";
import { warn } from "../logger";
import { getAPIBaseUrl, getDelay, isRetriableError } from "./httpConfig";
import { maybePrintErrors } from "./printErrors";

const debug = _debug.extend("api");

const headers = {
  "x-pw-version": "0.0.0",
  "x-pwc-version": pwcVersion,
};

export function setPWVersion(version: string) {
  headers["x-pw-version"] = version ?? "0.0.0";
}

const MAX_RETRIES = 3;

let _client: AxiosInstance | null = null;

export function getClient() {
  if (_client) {
    return _client;
  }
  _client = axios.create({
    baseURL: getAPIBaseUrl(),
  });

  _client.interceptors.request.use((config) => {
    config.headers.set({
      ...headers,
      // @ts-ignore
      "x-pwc-request-attempt": config["axios-retry"]?.retryCount ?? 0,
    });
    config.headers.set();

    if (!config.headers.get("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }

    const args = {
      ..._.pick(config, "method", "url", "headers"),
      data: Buffer.isBuffer(config.data) ? "buffer" : config.data,
    };

    debug("network request: %o", getNetworkRequestDebugData(args));
    return config;
  });

  axiosRetry(_client, {
    retries: MAX_RETRIES,
    retryCondition: isRetriableError,
    retryDelay: getDelay,
    // @ts-ignore
    onRetry,
  });
  return _client;
}

function getNetworkRequestDebugData(data: { headers: Record<string, string> }) {
  return {
    ...data,
    headers: {
      ...data.headers,
      ["x-currents-key"]: "***",
    },
  };
}
function onRetry(
  retryCount: number,
  err: AxiosError<{ message: string; errors?: string[] }>,
  _config: AxiosRequestConfig
) {
  warn(
    "Network request '%s' failed: '%s'. Next attempt is in %s (%d/%d).",
    `${_config.method?.toUpperCase()} ${_config.url}`,
    err.message,
    prettyMilliseconds(getDelay(retryCount)),
    retryCount,
    MAX_RETRIES
  );
}

export const makeRequest = <Response = any, Request = any>(
  config: Omit<AxiosRequestConfig<Request>, "headers">
) => {
  return getClient()<Request, AxiosResponse<Response>>(config)
    .then((res) => {
      debug("network response: %o", {
        ..._.omit(res, "request", "config"),
        url: res.config.url,
        method: res.config.method,
      });
      return res;
    })
    .catch((error) => {
      debugger;
      match(error)
        .when(isAxiosError, (err) => {
          maybePrintErrors(err);
          handleAxiosError(err);
        })
        .otherwise((err) => {
          throw err;
        });
    });
};

const ErrorCodes = {
  RUN_CANCELLED: "RUN_CANCELLED",
  RUN_EXPIRED: "RUN_EXPIRED",
} as const;

function handleAxiosError(error: AxiosError) {
  match(error.response?.data)
    .with({ code: ErrorCodes.RUN_CANCELLED, message: P.string }, (err) => {
      setCancellationReason(err.message);
      maybeCancelRun({ showWarning: false });
    })
    .with({ code: ErrorCodes.RUN_EXPIRED, message: P.string }, () => {
      warn(
        "This execution will not be recorded because the cloud run is expired."
      );
    })
    .otherwise((err) => {
      throw err;
    });
}
