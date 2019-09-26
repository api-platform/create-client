import SubmissionError from '../../../error/SubmissionError';
import fetch from '../../../utils/fetch';

export const createCommon = ({ commit }, { page, values }, { types }) => {
  commit(types.SET_ERROR, '');
  commit(types.TOGGLE_LOADING);

  return fetch(page, { method: 'POST', body: JSON.stringify(values) })
    .then(response => {
      commit(types.TOGGLE_LOADING);

      return response.json();
    })
    .then(data => {
      commit(types.SET_CREATED, data);
    })
    .catch(e => {
      commit(types.TOGGLE_LOADING);

      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.errors._error);
        return;
      }

      commit(types.SET_ERROR, e.message);
    });
};

export const resetCommon = ({ commit }, { types }) => {
  commit(types.RESET);
};
