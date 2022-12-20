import { isArray, isObject, isUndefined, forEach } from "lodash";
import type { SubmissionErrors } from "~~/types/error";
import { SubmissionError } from "~~/utils/error";
import { ENTRYPOINT } from "~~/utils/config";

const MIME_TYPE = "application/ld+json";

const transformRelationToIri = (payload: any) => {
  forEach(payload, (value, property) => {
    if ((isObject(value) as any) && !isUndefined(value["@id"])) {
      payload[property] = value["@id"];
    }

    if (isArray(value)) payload[property] = transformRelationToIri(value);
  });

  return payload;
};

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

  const payload: any = options.body && JSON.parse(options.body);
  if ((isObject(payload) as any) && payload["@id"]) {
    options.body = JSON.stringify(transformRelationToIri(payload));
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
