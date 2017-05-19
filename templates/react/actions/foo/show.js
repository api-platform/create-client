import {{{ lc }}}Fetch from '../../api/{{{ lc }}}Fetch';

export function retrieveError(retrieveError) {
  return {type: '{{{ uc }}}_SHOW_RETRIEVE_ERROR', retrieveError};
}

export function retrieveLoading(retrieveLoading) {
  return {type: '{{{ uc }}}_SHOW_RETRIEVE_LOADING', retrieveLoading};
}

export function retrieveSuccess(retrieved) {
  return {type: '{{{ uc }}}_SHOW_RETRIEVE_SUCCESS', retrieved};
}

export function retrieve(id) {
  return (dispatch) => {
    dispatch(retrieveLoading(true));

    return {{{ lc }}}Fetch(id)
      .then(response => response.json())
      .then(data => {
        dispatch(retrieveLoading(false));
        dispatch(retrieveSuccess(data));
      })
      .catch(e => {
        dispatch(retrieveLoading(false));
        dispatch(retrieveError(e.message));
      });
  };
}

export function reset() {
  return {type: '{{{ uc }}}_SHOW_RESET'};
}
