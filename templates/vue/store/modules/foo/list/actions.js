import fetch from '../../../../utils/fetch';
import { extractHubURL } from '../../../../utils/mercure';
import * as types from './mutation_types';

const getItems = ({ commit }, page = '{{{name}}}') => {
  commit(types.TOGGLE_LOADING);

  fetch(page)
    .then(response =>
      response.json().then(data => ({
        data,
        hubUrl: extractHubURL(response),
      }))
    )
    .then(({ data, hubUrl }) => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ITEMS, data['{{{hydraPrefix}}}member']);
      commit(types.SET_VIEW, data['{{{hydraPrefix}}}view']);

      if (hubUrl) {
        commit(types.SET_HUB_URL, hubUrl);
      }
    })
    .catch((e) => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ERROR, e.message);
    });
};

export const getSelectItems = (
  { commit },
  { page = '{{{name}}}', params = { properties: ['@id', 'name'] } } = {},
) => {
  commit(types.TOGGLE_LOADING);

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

export default getItems;
