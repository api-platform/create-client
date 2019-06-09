import SubmissionError from '../error/SubmissionError';
import { ENTRYPOINT } from '../config/entrypoint';

const MIME_TYPE = 'application/ld+json';

export default function(id, options = {}) {
  if (typeof options.headers === 'undefined') Object.assign(options, { headers: new Headers() });

  if (options.headers.get('Accept') === null) options.headers.set('Accept', MIME_TYPE);

  if (
    options.body !== undefined &&
    !(options.body instanceof FormData) &&
    options.headers.get('Content-Type') === null
  ) {
    options.headers.set('Content-Type', MIME_TYPE);
  }

  if (options.params) {
    var queryString = Object.keys(options.params)
      .map(key => key + '=' + options.params[key])
      .join('&');
    id = `${id}?${queryString}`;
  }

  const entryPoint = ENTRYPOINT + (ENTRYPOINT.endsWith('/') ? '' : '/');

  return fetch(new URL(id, entryPoint), options).then(response => {
    if (response.ok) return response;

    return response.json().then(json => {
      const error = json['{{{hydraPrefix}}}description']
        ? json['{{{hydraPrefix}}}description']
        : response.statusText;
      if (!json.violations) throw Error(error);

      const errors = { _error: error };
      json.violations.map(violation =>
        Object.assign(errors, { [violation.propertyPath]: violation.message }),
      );

      throw new SubmissionError(errors);
    });
  });
}
