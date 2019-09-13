import fetch from '../../../../utils/fetch';
import * as types from './mutation_types';

export const getItems = ({ commit }, { page = '{{{name}}}', params = {} }) => {
  commit(types.TOGGLE_LOADING);

  fetch(page, { params })
    .then(response => response.json())
    .then(data => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ITEMS, data['{{{hydraPrefix}}}member']);
      commit(types.SET_VIEW, data['{{{hydraPrefix}}}view']);
      commit(types.SET_TOTALITEMS, data['{{{hydraPrefix}}}totalItems']);
    })
    .catch(e => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ERROR, e.message);
    });
};

export const getSelectItems = ({ commit }, { page = '{{{name}}}', params = {} }) => {
  commit(types.TOGGLE_LOADING);

  const defaultParams = { properties: ['id', 'name'] };
  params = { ...defaultParams, ...params };

  fetch(page, { params })
    .then(response => response.json())
    .then(data => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_SELECT_ITEMS, data['hydra:member']);
    })
    .catch(e => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ERROR, e.message);
    });
};
