import fetch from '../../utils/fetch';

export function error(error) {
  return {type: '{{{ uc }}}_DELETE_ERROR', error};
}

export function loading(loading) {
  return {type: '{{{ uc }}}_DELETE_LOADING', loading};
}

export function success(deleted) {
  return {type: '{{{ uc }}}_DELETE_SUCCESS', deleted};
}

export function del(item) {
  return (dispatch) => {
    dispatch(loading(true));

    return fetch(item['@id'], {method: 'DELETE'})
      .then(() => {
        dispatch(loading(false));
        dispatch(success(item))
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message))
      });
  };
}
