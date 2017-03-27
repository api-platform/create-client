import {{{ lc }}}Fetch from '../../api/{{{ lc }}}Fetch';

export function error(error) {
  return {type: '{{{ uc }}}_CREATE_ERROR', error};
}

export function loading(loading) {
  return {type: '{{{ uc }}}_CREATE_LOADING', loading};
}

export function success(created) {
  return {type: '{{{ uc }}}_CREATE_SUCCESS', created};
}

export function create(values) {
  return (dispatch) => {
    dispatch(loading(true));

    {{{ lc }}}Fetch('/{{{ name }}}', {method: 'POST', body: JSON.stringify(values)})
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(data => dispatch(success(data)))
      .catch(e => {
        dispatch(loading(false));

        dispatch(error(e.message))
      });
  };
}
