import fetch from '../../../utils/fetch';

export const delCommon = ({ commit }, item, { types }) => {
  commit(types.TOGGLE_LOADING);

  return fetch(item['@id'], { method: 'DELETE' })
    .then(() => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_DELETED, item);
    })
    .catch(e => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ERROR, e.message);
    });
};

export const resetCommon = ({ commit }, { types }) => {
  commit(types.RESET);
};
