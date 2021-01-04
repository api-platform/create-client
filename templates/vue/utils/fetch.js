import { isArray, isObject, isUndefined, forEach } from 'lodash';
import { ENTRYPOINT } from '../config/entrypoint';
import SubmissionError from '../error/SubmissionError';

const MIME_TYPE = 'application/ld+json';

const transformRelationToIri = (payload) => {
  forEach(payload, (value, property) => {
    if (isObject(value) && !isUndefined(value['@id'])) {
      payload[property] = value['@id'];
    }

    if (isArray(value)) payload[property] = transformRelationToIri(value);
  });

  return payload;
};

export default function(id, options = {}) {
  if ('undefined' === typeof options.headers) options.headers = new Headers();

  if (null === options.headers.get('Accept'))
    options.headers.set('Accept', MIME_TYPE);

  if (
    'undefined' !== options.body &&
    !(options.body instanceof FormData) &&
    null === options.headers.get('Content-Type')
  )
    options.headers.set('Content-Type', MIME_TYPE);

  const payload = options.body && JSON.parse(options.body);
  if (isObject(payload) && payload['@id'])
    options.body = JSON.stringify(transformRelationToIri(payload));

  return global.fetch(new URL(id, ENTRYPOINT), options).then(response => {
    if (response.ok) return response;

    return response.json().then((json) => {
      const error = json['{{{hydraPrefix}}}description'] || response.statusText;
      if (!json.violations) throw Error(error);

      let errors = { _error: error };
      json.violations.map(
        violation => (errors[violation.propertyPath] = violation.message)
      );

      throw new SubmissionError(errors);
    });
  });
}
