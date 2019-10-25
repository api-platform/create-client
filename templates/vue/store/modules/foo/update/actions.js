import SubmissionError from '../../../../error/SubmissionError';
import fetch from '../../../../utils/fetch';
import * as types from './mutation_types';

export const reset = ({ commit }) => {
  commit(types.RESET);
};

export const retrieve = ({ commit }, id) => {
  commit(types.TOGGLE_LOADING);

  return fetch(id)
    .then(response => response.json())
    .then((data) => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_RETRIEVED, data);
    })
    .catch((e) => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_ERROR, e.message);
    });
};

export const update = ({ commit, state }, payload) => {
  commit(types.SET_ERROR, '');
  commit(types.TOGGLE_LOADING);

  return fetch(state.retrieved['@id'], {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/ld+json' }),
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then((data) => {
      commit(types.TOGGLE_LOADING);
      commit(types.SET_UPDATED, data);
    })
    .catch((e) => {
      commit(types.TOGGLE_LOADING);

      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.errors._error);

        return;
      }

      // eslint-disable-next-line
      commit(types.SET_ERROR, e.message);
    });
};

export const updateRetrieved = ({ commit }, updated) => {
  commit(types.UPDATE_RETRIEVED, updated);
};
