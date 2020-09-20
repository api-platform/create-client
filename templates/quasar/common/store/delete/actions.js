import fetch from '../../../utils/fetch';

export const delCommon = ({ commit }, { item, ep }, { types }) => {
  commit(types.TOGGLE_LOADING);

  return fetch({ id: item['@id'], ep }, { method: 'DELETE' })
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
