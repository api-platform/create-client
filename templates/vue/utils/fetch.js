import SubmissionError from '../error/SubmissionError'
import { ENTRYPOINT } from '../config/entrypoint';

const MIME_TYPE = 'application/ld+json'

function buildURL(entrypoint, id) {
  entrypoint = entrypoint.replace(/\/+$/, '');

  let splittedEntrypointPath = new URL(entrypoint).pathname.replace(/^\/+/, '').split('/');
  let splittedId = id.replace(/^\/+/, '').split('/');

  while (splittedEntrypointPath[0] === splittedId[0]) {
    splittedEntrypointPath = splittedEntrypointPath.slice(1);
    splittedId = splittedId.slice(1);
  }

  return `${entrypoint}/${splittedId.join('/')}`;
}

export default function (id, options = {}) {
  if (typeof options.headers === 'undefined') Object.assign(options, { headers: new Headers() })

  if (options.headers.get('Accept') === null) options.headers.set('Accept', MIME_TYPE)

  if (options.body !== undefined && !(options.body instanceof FormData) && options.headers.get('Content-Type') === null) {
    options.headers.set('Content-Type', MIME_TYPE)
  }

  return fetch(buildURL(ENTRYPOINT, id), options).then((response) => {
    if (response.ok) return response

    return response
      .json()
      .then((json) => {
        const error = json['{{{hydraPrefix}}}description'] ? json['{{{hydraPrefix}}}description'] : response.statusText
        if (!json.violations) throw Error(error)

        const errors = { _error: error }
        json.violations.map(violation =>
          Object.assign(errors, { [violation.propertyPath]: violation.message }))

        throw new SubmissionError(errors)
      })
  })
}
