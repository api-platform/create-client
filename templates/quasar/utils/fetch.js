import SubmissionError from '../error/SubmissionError';

const MIME_TYPE = 'application/ld+json';

// make query string array of values
const makeParamArray = (key, arr) => arr.map(val => `${key}[]=${val}`).join('&');

export default function({ id, ep }, options = {}) {
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
      .map(key =>
        Array.isArray(options.params[key])
          ? makeParamArray(key, options.params[key])
          : `${key}=${options.params[key]}`,
      )
      .join('&');
    id = `${id}?${queryString}`;
  }

  // enable CORS for all requests
  Object.assign(options, {
    mode: 'cors',
    // credentials: 'include', // when credentials needed
  });

  const entryPoint = ep + (ep.endsWith('/') ? '' : '/');

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
