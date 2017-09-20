import {{{ lc }}}Fetch from '../../api/{{{ lc }}}Fetch';

export function error(error) {
  return {type: '{{{ uc }}}_SHOW_ERROR', error};
}

export function loading(loading) {
  return {type: '{{{ uc }}}_SHOW_LOADING', loading};
}

export function retrieved(retrieved) {
  return {type: '{{{ uc }}}_SHOW_RETRIEVED_SUCCESS', retrieved};
}

export function retrieve(id) {
  return (dispatch) => {
    dispatch(loading(true));

    return {{{ lc }}}Fetch(id)
      .then(response => response.json())
      .then(data => {
        dispatch(loading(false));
        dispatch(retrieved(data));
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));
      });
  };
}

export function reset() {
  return {type: '{{{ uc }}}_SHOW_RESET'};
}
