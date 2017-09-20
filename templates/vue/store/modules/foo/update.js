import SubmissionError from '../../../error/SubmissionError';
import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';

const {{{ uc }}}_UPDATE_RESET = '{{{ uc }}}_UPDATE_RESET';
const {{{ uc }}}_UPDATE_UPDATE_ERROR = '{{{ uc }}}_UPDATE_UPDATE_ERROR';
const {{{ uc }}}_UPDATE_UPDATE_LOADING = '{{{ uc }}}_UPDATE_UPDATE_LOADING';
const {{{ uc }}}_UPDATE_UPDATE_SUCCESS = '{{{ uc }}}_UPDATE_UPDATE_SUCCESS';
const {{{ uc }}}_UPDATE_RETRIEVE_ERROR = '{{{ uc }}}_UPDATE_RETRIEVE_ERROR';
const {{{ uc }}}_UPDATE_RETRIEVE_LOADING = '{{{ uc }}}_UPDATE_RETRIEVE_LOADING';
const {{{ uc }}}_UPDATE_RETRIEVE_SUCCESS = '{{{ uc }}}_UPDATE_RETRIEVE_SUCCESS';
const {{{ uc }}}_UPDATE_UPDATE_VIOLATIONS = '{{{ uc }}}_UPDATE_UPDATE_VIOLATIONS';

const state = {
  loading: false,
  retrieveError: '',
  retrieveLoading: false,
  retrieved: null,
  updated: null,
  updateError: '',
  updateLoading: false,
  violations: null
};

function retrieveError(commit, retrieveError) {
  return commit({{{ uc }}}_UPDATE_RETRIEVE_ERROR, retrieveError);
}

function retrieveLoading(commit, retrieveLoading) {
  return commit({{{ uc }}}_UPDATE_RETRIEVE_LOADING, retrieveLoading);
}

function retrieveSuccess(commit, retrieved) {
  return commit({{{ uc }}}_UPDATE_RETRIEVE_SUCCESS, retrieved);
}

export function updateError(commit, updateError) {
  return commit({{{ uc }}}_UPDATE_UPDATE_ERROR, updateError);
}

export function updateLoading(commit, updateLoading) {
  return commit({{{ uc }}}_UPDATE_UPDATE_LOADING, updateLoading);
}

export function updateSuccess(commit, updated) {
  return commit({{{ uc }}}_UPDATE_UPDATE_SUCCESS, updated);
}

export function reset(commit) {
  return commit({{{ uc }}}_UPDATE_RESET);
}

function violations(commit, violations) {
  return commit({{{ uc }}}_UPDATE_UPDATE_VIOLATIONS, violations);
}

const getters = {
  loading: state => state.loading,
  retrieveError: state => state.retrieveError,
  retrieveLoading: state => state.retrieveLoading,
  retrieved: state => state.retrieved,
  updated: state => state.updated,
  updateError: state => state.updateError,
  updateLoading: state => state.updateLoading,
  violations: state => state.violations
};

const actions = {
  retrieve({ commit }, id) {
    retrieveLoading(commit, true);

    return {{{ lc }}}Fetch(id)
      .then(response => response.json())
      .then(data => {
        retrieveLoading(commit, false);
        retrieveSuccess(commit, data);
      })
      .catch(e => {
        retrieveLoading(commit, false);
        retrieveError(commit, e.message);
      });
  },
  update({ commit, state }, { item, values }) {
    updateError(commit, null);
    updateLoading(commit, true);

    return {{{ lc }}}Fetch(item['@id'], {
        method: 'PUT',
        headers: new Headers({'Content-Type': 'application/ld+json'}),
        body: JSON.stringify(values),
      }
    )
      .then(response => response.json())
      .then(data => {
        updateLoading(commit, false);
        updateSuccess(commit, data);
      })
      .catch(e => {
        updateLoading(commit, false);

        if (e instanceof SubmissionError) {
          violations(commit, e.errors);
          updateError(commit, e.errors._error);
          return;
        }

        updateError(commit, e.message);
      });
  },
  reset({ commit }) {
    reset(commit);
  }
};

const mutations = {
    [{{{ uc }}}_UPDATE_RETRIEVE_ERROR] (state, retrieveError) {
      state.retrieveError = retrieveError;
    },
    [{{{ uc }}}_UPDATE_RETRIEVE_LOADING] (state, retrieveLoading) {
      state.retrieveLoading = retrieveLoading;
    },
    [{{{ uc }}}_UPDATE_RETRIEVE_SUCCESS] (state, retrieved) {
      state.retrieved = retrieved;
    },
    [{{{ uc }}}_UPDATE_UPDATE_LOADING] (state, loading) {
      state.updateLoading = loading;
    },
    [{{{ uc }}}_UPDATE_UPDATE_ERROR] (state, updateError) {
      state.updateError = updateError;
    },
    [{{{ uc }}}_UPDATE_UPDATE_LOADING] (state, updateLoading) {
      state.updateLoading = updateLoading;
    },
    [{{{ uc }}}_UPDATE_UPDATE_SUCCESS] (state, updated) {
      state.updated = updated;
      state.violations = null;
    },
    [{{{ uc }}}_UPDATE_UPDATE_VIOLATIONS] (state, violations) {
      state.violations = violations;
    },
    [{{{ uc }}}_UPDATE_RESET] (state) {
      state.loading = false;
      state.retrieveError = '';
      state.retrieveLoading = false;
      state.retrieved = null;
      state.updated = null;
      state.updateError = '';
      state.updateLoading = false;
      state.violations = null;
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
