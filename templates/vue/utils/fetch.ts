import { isArray, isObject, isUndefined, forEach } from "lodash";
import { ENTRYPOINT } from "../config/entrypoint";
import SubmissionError from "../error/SubmissionError";
import type { SubmissionErrors } from "./types";

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

export default function (id: string, options: any = {}) {
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

  return fetch(new URL(id, ENTRYPOINT), options).then((response: Response) => {
    if (response.ok) return response;

    return response.json().then((json) => {
      const error = json["{{{hydraPrefix}}}description"] || response.statusText;
      if (!json.violations) throw Error(error);

      const errors: SubmissionErrors = { _error: error };
      json.violations.map(
        (violation: { propertyPath: string; message: string }) =>
          (errors[violation.propertyPath] = violation.message)
      );

      throw new SubmissionError(errors);
    });
  });
}
