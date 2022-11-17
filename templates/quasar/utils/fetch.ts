import { SubmissionError, SubmissionErrors } from 'src/types/error';
import qs from 'qs';
import { ENTRYPOINT } from 'src/config/entrypoint';

const MIME_TYPE = 'application/ld+json';

export default function (id: string, options: any = {}) {
  if (typeof options.headers === 'undefined') {
    Object.assign(options, { headers: new Headers() });
  }

  if (options.headers.get('Accept') === null) {
    options.headers.set('Accept', MIME_TYPE);
  }

  if (
    options.body !== undefined &&
    !(options.body instanceof FormData) &&
    options.headers.get('Content-Type') === null
  ) {
    options.headers.set('Content-Type', MIME_TYPE);
  }

  if (options.params) {
    const queryString = qs.stringify(options.params);
    id = `${id}?${queryString}`;
  }

  // enable CORS for all requests
  Object.assign(options, {
    mode: 'cors',
    // credentials: 'include', // when credentials needed
  });

  return fetch(new URL(id, ENTRYPOINT), options).then((response: Response) => {
    if (response.ok) return response;

    return response.json().then((json) => {
      const error = json['hydra:description'] ?? response.statusText;
      if (!json.violations) throw Error(error);

      const errors: SubmissionErrors = { _error: error };
      json.violations.map(
        (violation: { propertyPath: string; message: string }) => {
          errors[violation.propertyPath] = violation.message;
        }
      );

      throw new SubmissionError(errors);
    });
  });
}
