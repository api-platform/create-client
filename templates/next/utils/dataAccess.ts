import get from "lodash/get";
import has from "lodash/has";
import mapValues from "lodash/mapValues";
import isomorphicFetch from "isomorphic-unfetch";
import { ENTRYPOINT } from "../config/entrypoint";
import { SubmissionError, SubmissionErrorList } from "../error/SubmissionError";

const MIME_TYPE = "application/ld+json";

interface Violation {
  message: string;
  propertyPath: string;
}

export const fetch = async (id: string, init: RequestInit = {}) => {
  if (typeof init.headers === "undefined") init.headers = {};
  if (!init.headers.hasOwnProperty("Accept"))
    init.headers = { ...init.headers, Accept: MIME_TYPE };
  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    !init.headers.hasOwnProperty("Content-Type")
  )
    init.headers = { ...init.headers, "Content-Type": MIME_TYPE };

  const resp = await isomorphicFetch(ENTRYPOINT + id, init);
  if (resp.status === 204) return;

  const json = await resp.json();
  if (resp.ok) return normalize(json);

  const error = json["{{{hydraPrefix}}}description"] || resp.statusText;
  if (!json.violations) throw Error(error);

  const errors: SubmissionErrorList = { _error: error };
  json.violations.map(
    (violation: Violation) =>
      (errors[violation.propertyPath] = violation.message)
  );

  throw new SubmissionError(errors);
};

export const normalize = (data: any) => {
  if (has(data, "{{{hydraPrefix}}}member")) {
    // Normalize items in collections
    data["{{{hydraPrefix}}}member"] = data[
      "{{{hydraPrefix}}}member"
    ].map((item: any) => normalize(item));

    return data;
  }

  // Flatten nested documents
  return mapValues(data, (value) =>
    Array.isArray(value)
      ? value.map((v) => get(v, "@id", v))
      : get(value, "@id", value)
  );
};
