import SubmissionError from '../error/SubmissionError'
import { API_ENTRYPOINT } from '../config/_entrypoint'

const jsonLdMimeType = 'application/ld+json'

export default function (id, options = {}) {
  if (typeof options.headers === 'undefined') Object.assign(options, { headers: new Headers() })

  if (options.headers.get('Accept') === null) options.headers.set('Accept', jsonLdMimeType)

  if (options.body !== undefined && !(options.body instanceof FormData) && options.headers.get('Content-Type') === null) {
    options.headers.set('Content-Type', jsonLdMimeType)
  }

  return fetch(new URL(id, API_ENTRYPOINT).toString(), options).then((response) => {
    if (response.ok) return response

    return response
      .json()
      .then((json) => {
        const error = json['{{{ hydraPrefix }}}description'] ? json['{{{ hydraPrefix }}}description'] : response.statusText
        if (!json.violations) throw Error(error)

        const errors = { _error: error }
        json.violations.map(violation =>
          Object.assign(errors, { [violation.propertyPath]: violation.message }))

        throw new SubmissionError(errors)
      })
  })
}
