import fetch from '../../../../utils/fetch';
import * as types from './mutation_types';

export const retrieve = ({ commit }, id) => {
  commit(types.{{{uc}}}_SHOW_TOGGLE_LOADING);

  return fetch(id)
    .then(response => response.json())
    .then((data) => {
      commit(types.{{{uc}}}_SHOW_TOGGLE_LOADING);
      commit(types.{{{uc}}}_SHOW_SET_RETRIEVED, data);
    })
    .catch((e) => {
      commit(types.{{{uc}}}_SHOW_TOGGLE_LOADING);
      commit(types.{{{uc}}}_SHOW_SET_ERROR, e.message);
    });
};

export const reset = ({ commit }) => {
  commit(types.{{{uc}}}_SHOW_RESET);
};
