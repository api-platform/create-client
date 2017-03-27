import {{{ lc }}}Fetch from '../../api/{{{ lc }}}Fetch';

export function error(error) {
  return {type: '{{{ uc }}}_LIST_ERROR', error};
}

export function loading(loading) {
  return {type: '{{{ uc }}}_LIST_LOADING', loading};
}

export function success(items) {
  return {type: '{{{ uc }}}_LIST_SUCCESS', items};
}

export function list() {
  return (dispatch) => {
    dispatch(loading(true));

    {{{ lc }}}Fetch('/{{{ name }}}')
      .then(response => response.json())
      .then(data => {
        dispatch(loading(false));
        dispatch(success(data['{{{ hydraPrefix }}}member']));
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message))
      });
  };
}

export function reset() {
  return {type: '{{{ uc }}}_LIST_RESET'};
}
