import { AxiosError } from "axios";
import _ from "lodash";
import { P, match } from "ts-pattern";
import { error, spacer, warn } from "../logger";

export function maybePrintErrors(err: AxiosError) {
  if (!err.response?.data || !err.response?.status) {
    return;
  }

  match(err.response)
    .with({ status: 401 }, () => {
      warn("[currents] received 401 Unauthorized Request from cloud service");
    })
    .with(
      {
        status: 422,
      },
      (response) => {
        match(response.data)
          .with({ message: P.string, errors: P.array(P.string) }, (data) => {
            const { message, errors } = data;
            spacer(1);
            warn(...formatGenericError(message, errors));
            spacer(1);
          })
          .otherwise(() => {
            warn(
              "[currents] received 422 Unprocessable Entity from cloud service"
            );
          });
      }
    )
    .otherwise(() => {
      error("Unexpected error from the cloud service: %s\n%O", err.toJSON());
    });
}

export function formatGenericError(
  message?: string,
  errors?: string[]
): string[] {
  if (!_.isString(message)) {
    return ["Unexpected error from the cloud service"];
  }

  if (errors?.length === 0) {
    return [message as string];
  }
  return [
    message as string,
    `
${(errors ?? []).map((e) => `  - ${e}`).join("\n")}
`,
  ];
}
