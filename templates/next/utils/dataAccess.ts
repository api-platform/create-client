import get from 'lodash/get';
import has from 'lodash/has';
import mapValues from 'lodash/mapValues';
import isomorphicFetch from 'isomorphic-unfetch';
import { ENTRYPOINT } from '../config/entrypoint';
import {SubmissionError, SubmissionErrorList} from '../error/SubmissionError';

const MIME_TYPE = 'application/ld+json';

interface Violation {
  message: string;
  propertyPath: string;
}

export const fetch = (id: string, init: RequestInit = {}) => {
  if ('undefined' === typeof init.headers) {
    init.headers = {};
  }

  if (!init.headers.hasOwnProperty('Accept')) {
    init.headers = {...init.headers, 'Accept': MIME_TYPE};
  }

  if (
    undefined !== init.body &&
    !(init.body instanceof FormData) &&
    !init.headers.hasOwnProperty('Content-Type')
  ) {
    init.headers = {...init.headers, 'Content-Type': MIME_TYPE};
  }

  return isomorphicFetch(ENTRYPOINT + id, init)
    .then((response: Response): any => {
      if (response.ok) {
        return response.json()
          .then (json => normalize(json));
      }

      return response.json().then(json => {
        const error = json['{{{hydraPrefix}}}description'] || response.statusText;

        if (!json.violations) {
          throw Error(error);
        }

        let errors: SubmissionErrorList = { _error: error };
        json.violations.map(
          (violation: Violation) => (errors[violation.propertyPath] = violation.message)
        );

        throw new SubmissionError(errors);
      });
    });
}

export const normalize = (data: any) => {
  if (has(data, '{{{hydraPrefix}}}member')) {
    // Normalize items in collections
    data['{{{hydraPrefix}}}member'] = data['{{{hydraPrefix}}}member'].map((item: any) => normalize(item));

    return data;
  }

  // Flatten nested documents
  return mapValues(data, value =>
    Array.isArray(value)
      ? value.map(v => get(v, '@id', v))
      : get(value, '@id', value)
  );
}
