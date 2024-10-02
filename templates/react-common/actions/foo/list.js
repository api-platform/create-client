import { fetch, normalize } from '../../utils/dataAccess';
import { extractHubURL, mercureSubscribe as subscribe } from "../../utils/mercure";
import { success as deleteSuccess } from './delete';

export function error(error) {
  return { type: '{{{uc}}}_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: '{{{uc}}}_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: '{{{uc}}}_LIST_SUCCESS', retrieved };
}

export function list(page = '{{{name}}}') {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    fetch(page)
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(success(retrieved));

        if (hubURL && retrieved['{{hydraPrefix}}member'].length)
          dispatch(
            mercureSubscribe(
              hubURL,
              retrieved['{{hydraPrefix}}member'].map(i => i['@id'])
            )
          );
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: '{{{uc}}}_LIST_RESET' });
    dispatch(deleteSuccess(null));
  };
}

export function mercureSubscribe(hubURL, topics) {
  return dispatch => {
    const eventSource = subscribe(hubURL, topics, data =>
      dispatch(mercureMessage(normalize(data))));
    dispatch(mercureOpen(eventSource));
  };
}

export function mercureOpen(eventSource) {
  return { type: '{{{uc}}}_LIST_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: '{{{uc}}}_LIST_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: '{{{uc}}}_LIST_MERCURE_MESSAGE', retrieved });
  };
}
