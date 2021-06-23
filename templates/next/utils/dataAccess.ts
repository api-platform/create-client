import get from "lodash/get";
import has from "lodash/has";
import mapValues from "lodash/mapValues";
import isomorphicFetch from "isomorphic-unfetch";
import { ENTRYPOINT } from "../config/entrypoint";

const MIME_TYPE = "application/ld+json";

interface Violation {
  message: string;
  propertyPath: string;
}

const extractHubURL = (response: Response): null | URL => {
  const linkHeader = response.headers.get('Link');
  if (!linkHeader) return null;

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
};

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
  if (resp.ok) {
    return {
      hubURL: extractHubURL(resp)?.toString(), // URL cannot be serialized as JSON, must be sent as string
      data: normalize(json),
    };
  }

  const defaultErrorMsg = json["{{{hydraPrefix}}}title"];
  const status = json["{{{hydraPrefix}}}description"] || resp.statusText;
  if (!json.violations) throw Error(defaultErrorMsg);
  const fields = {};
  json.violations.map(
    (violation: Violation) =>
      (fields[violation.propertyPath] = violation.message)
  );

  throw { defaultErrorMsg, status, fields };
};

export const normalize = (data: unknown) => {
  if (has(data, "{{{hydraPrefix}}}member")) {
    // Normalize items in collections
    data["{{{hydraPrefix}}}member"] = data[
      "{{{hydraPrefix}}}member"
    ].map((item: unknown) => normalize(item));

    return data;
  }

  // Flatten nested documents
  return mapValues(data, (value) =>
    Array.isArray(value)
      ? value.map((v) => get(v, "@id", v))
      : get(value, "@id", value)
  );
};
