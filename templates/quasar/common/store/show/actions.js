import fetch from '../../../utils/fetch';

export const retrieveCommon = ({ commit }, dest, { types }) => {
  commit(types.TOGGLE_LOADING);

  return fetch(dest)
    .then(response => response.json())
    .then(data => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_RETRIEVED, data);
    })
    .catch(e => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ERROR, e.message);
    });
};

export const resetCommon = ({ commit }, { types }) => {
  commit(types.RESET);
};
