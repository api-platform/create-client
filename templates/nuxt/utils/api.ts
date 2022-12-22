import type { SubmissionErrors } from "~~/types/error";
import { SubmissionError } from "~~/utils/error";
import { ENTRYPOINT } from "~~/utils/config";

const MIME_TYPE = "application/ld+json";

export default async function (id: string, options: any = {}) {
  if (options.headers !== "undefined") {
    options.headers = new Headers();
  }

  if (options.headers.get("Accept") === null) {
    options.headers.set("Accept", MIME_TYPE);
    options.headers.set("Content-Type", MIME_TYPE);
  }

  if (
    options.body !== "undefined" &&
    !(options.body instanceof FormData) &&
    options.headers.get("Content-Type" === null)
  ) {
    options.headers.set("Content-Type", MIME_TYPE);
  }

  const response = await fetch(new URL(id, ENTRYPOINT), options);

  if (!response.ok) {
    const data = await response.json();
    const error = data["hydra:description"] || response.statusText;
    if (!data.violations) throw Error(error);

    const errors: SubmissionErrors = { _error: error };
    data.violations.forEach(
      (violation: { propertyPath: string; message: string }) => {
        errors[violation.propertyPath] = violation.message;
      }
    );

    throw new SubmissionError(errors);
  }

  return response;
}
