import fetch from '../../../utils/fetch';

export const getItemsCommon = (
  { commit },
  { page, ep, params },
  { types, hydraPrefix }
) => {
  commit(types.TOGGLE_LOADING);
  return fetch({ id: page, ep }, { params })
    .then(response => response.json())
    .then(data => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ITEMS, data[`${hydraPrefix}member`]);
      commit(types.SET_VIEW, data[`${hydraPrefix}view`]);
      commit(types.SET_TOTALITEMS, data[`${hydraPrefix}totalItems`]);
    })
    .catch(e => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ERROR, e.message);
    });
};

export const getSelectItemsCommon = (
  { commit },
  { page, ep, params },
  { types, hydraPrefix }
) => {
  commit(types.TOGGLE_LOADING);
  return fetch({ id: page, ep }, { params })
    .then(response => response.json())
    .then(data => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_SELECT_ITEMS, data[`${hydraPrefix}member`]);
    })
    .catch(e => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ERROR, e.message);
    });
};
