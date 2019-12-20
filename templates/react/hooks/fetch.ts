import { useState } from "react";
import { ENTRYPOINT } from "../config/entrypoint";
import { SubmissionErrors, SubmissionError } from "../utils/types";

interface FetchResponse {
  readonly response: Response;
  readonly json: any;
}

export interface IFetchStore {
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<FetchResponse>;
  setAuth: (auth: string) => void;
}

const normalizeUrl = (url: string) => {
  return String(new URL(url, ENTRYPOINT));
}

const normalizeInput = (input: RequestInfo): RequestInfo => {
  if (typeof input === "string") {
    return normalizeUrl(input);
  }

  return {...input, url: normalizeUrl(input.url)};
}

const MIME_TYPE = "application/ld+json";

const normalizeHeaders = (options: RequestInit): RequestInit => {
  if (!(options.headers instanceof Headers)) {
    options.headers = new Headers(options.headers);
  }

  return options;
}

const normalizeContentType = (options: RequestInit): RequestInit => {
  if (
    "undefined" !== options.body
    && !(options.body instanceof FormData)
    && (options.headers instanceof Headers)
    && null === options.headers.get("Content-Type")
  ) {
    options.headers.set("Content-Type", MIME_TYPE);
  }

  return options;
}

const normalizeAuth = (auth: string) => {
  return (options: RequestInit): RequestInit => {
    if (
      auth
      && (options.headers instanceof Headers)
      && null === options.headers.get("Authorization")
    ) {
      options.headers.set("Authorization", auth);
    }

    return options;
  };
}

// Error handling
const regularHandler = (response: Response, json: any) => {
  const error =
    json["hydra:description"] ||
    json["hydra:title"] ||
    json["message"] ||
    "An error occurred.";

  throw new Error(error);
}

const submissionHandler = (response: Response, json: any) => {
  if (!json.violations) {
    return;
  }

  const error =
    json["hydra:description"] ||
    json["hydra:title"] ||
    json["message"] ||
    "An error occurred.";

  const violations: { propertyPath: string; message: string; }[] = json.violations;

  const errors = violations
    .reduce((errors, violation) => {
      if (errors[violation.propertyPath]) {
        errors[violation.propertyPath] += "\n" + violation.message;
      } else {
        errors[violation.propertyPath] = violation.message;
      }

      return errors;
    }, {} as SubmissionErrors);

  throw new SubmissionError(error, errors);
}

const useFetch = (): IFetchStore => {
  const [auth, setAuth] = useState("");

  return {
    setAuth,

    fetch(input, init = {}) {
      input = normalizeInput(input);
      init = [
        normalizeHeaders,
        normalizeContentType,
        normalizeAuth(auth),
      ].reduce((init, normalize) => normalize(init), init);

      if (init.method === 'DELETE') {
        return fetch(input, init)
          .then(
            response => ({ response, json: null })
          )
      }

      return fetch(input, init)
        .then(
          response => response
            .json()
            .then<{ response: Response; json: object; }>(json => ({response, json}))
            .catch(() => {
              throw new Error(response.statusText || "An error occurred.");
            })
          ,
        )
        .then((data) => {
          if (!data.response.ok) {
            submissionHandler(data.response, data.json);
            regularHandler(data.response, data.json);
          }

          return data;
        })
    },
  };
}

export default useFetch;
