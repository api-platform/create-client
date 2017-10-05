import fetch from '../../utils/fetch';

export function error(error) {
  return {type: '{{{ uc }}}_LIST_ERROR', error};
}

export function loading(loading) {
  return {type: '{{{ uc }}}_LIST_LOADING', loading};
}

export function success(items) {
  return {type: '{{{ uc }}}_LIST_SUCCESS', items};
}

export function view(items) {
  return { type: '{{{ uc }}}_LIST_VIEW', items};
}

export function page(page) {
  return (dispatch) => {
    dispatch(loading(true));
    dispatch(error(''));

    fetch(page)
      .then(response => response.json())
      .then(data => {
        dispatch(loading(false));
        dispatch(success(data['{{{ hydraPrefix }}}member']));
        dispatch(view(data['{{{ hydraPrefix }}}view']));
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message))
      });
  };
}

export function list() {
  return page('/{{{ name }}}');
}

export function reset() {
  return {type: '{{{ uc }}}_LIST_RESET'};
}
