import isomorphicFetch from "isomorphic-unfetch";

import { PagedCollection } from "../types/collection";
import { Item } from "../types/item";
import { ENTRYPOINT } from "../config/entrypoint";

const MIME_TYPE = "application/ld+json";

interface Violation {
  message: string;
  propertyPath: string;
}

export interface FetchResponse<TData> {
  hubURL: string | null;
  data: TData;
  text: string;
}

export interface FetchError {
  message: string;
  status: string;
  fields: {[key: string]: string};
}

const extractHubURL = (response: Response): null | URL => {
  const linkHeader = response.headers.get("Link");
  if (!linkHeader) return null;

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
};

export const fetch = async <TData>(id: string, init: RequestInit = {}): Promise<FetchResponse<TData>|undefined> => {
  if (typeof init.headers === "undefined") init.headers = {};
  if (!init.headers.hasOwnProperty("Accept"))
    init.headers = { ...init.headers, Accept: MIME_TYPE };
  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    !init.headers?.hasOwnProperty("Content-Type")
  )
    init.headers = { ...init.headers, "Content-Type": MIME_TYPE };

  const resp = await isomorphicFetch(ENTRYPOINT + id, init);
  if (resp.status === 204) return;

  const text = await resp.text();
  const json = JSON.parse(text);
  if (resp.ok) {
    return {
      hubURL: extractHubURL(resp)?.toString() || null, // URL cannot be serialized as JSON, must be sent as string
      data: json,
      text,
    };
  }

  const errorMessage = json["{{{hydraPrefix}}}title"];
  const status = json["{{{hydraPrefix}}}description"] || resp.statusText;
  if (!json.violations) throw Error(errorMessage);
  const fields: { [key: string]: string } = {};
  json.violations.map(
    (violation: Violation) =>
      (fields[violation.propertyPath] = violation.message)
  );

  throw { message: errorMessage, status, fields } as FetchError;
};

export const getPaths = async <TData extends Item>(response: FetchResponse<PagedCollection<TData>> | undefined, resourceName: string, isEdit: boolean) => {
  if (!response) return [];

  try {
    const pathSuffix = isEdit ? "/edit" : "";
    const view = response.data["{{{hydraPrefix}}}view"];
    const paths = response.data["{{{hydraPrefix}}}member"]?.map((resourceData) => `${resourceData['@id']}${pathSuffix}`) || [];

    const { "hydra:last": last } = view || {};
    if (last) {
      for (let page = 2; page <= parseInt(last.replace(new RegExp(`^\/${resourceName}\?page=(\d+)`), "$1")); page++) {
        paths.concat(
          (await fetch<PagedCollection<TData>>(`/${resourceName}?page=${page}`))
            ?.data["{{{hydraPrefix}}}member"]?.map((resourceData) => `${ resourceData['@id'] }${pathSuffix}`) || []
        );
      }
    }

    return paths;
  } catch (e) {
    console.error(e);

    return [];
  }
};
