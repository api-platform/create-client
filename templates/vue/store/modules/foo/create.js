import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';

const {{{ uc }}}_CREATE_ERROR = '{{{ uc }}}_CREATE_ERROR';
const {{{ uc }}}_CREATE_LOADING = '{{{ uc }}}_CREATE_LOADING';
const {{{ uc }}}_CREATE_SUCCESS = '{{{ uc }}}_CREATE_SUCCESS';
const {{{ uc }}}_CREATE_VIOLATIONS = '{{{ uc }}}_CREATE_VIOLATIONS';
const {{{ uc }}}_CREATE_RESET = '{{{ uc }}}_CREATE_RESET';

const state = {
  loading: false,
  error: '',
  created: null
};

function error(commit, error) {
  return commit({{{ uc }}}_CREATE_ERROR, error);
}

function loading(commit, loading) {
  return commit({{{ uc }}}_CREATE_LOADING, loading);
}

function success(commit, created) {
  return commit({{{ uc }}}_CREATE_SUCCESS, created);
}

function violations(commit, violations) {
  return commit({{{ uc }}}_CREATE_VIOLATIONS, violations);
}

function reset(commit) {
  return commit({{{ uc }}}_CREATE_RESET);
}

const getters = {
  created: state => state.created,
  error: state => state.error,
  loading: state => state.loading,
  violations: state => state.violations,
};

const actions = {
  create({ commit }) {
    loading(commit, true);

    return {{{ lc }}}Fetch('/{{{ name }}}', {method: 'POST', body: JSON.stringify(values)})
      .then(response => {
        loading(commit, false);

        return response.json();
      })
      .then(data => {
        success(commit, data);
      })
      .catch(e => {
        loading(commit, false);
        error(commit, e.message);
      });
  },
  reset({ commit }) {
    reset(commit);
  }
};

const mutations = {
    [{{{ uc }}}_CREATE_ERROR] (state, error) {
      state.error = error;
    },
    [{{{ uc }}}_CREATE_LOADING] (state, loading) {
      state.loading = loading;
    },
    [{{{ uc }}}_CREATE_SUCCESS] (state, created) {
      state.created = created;
    },
    [{{{ uc }}}_CREATE_VIOLATIONS] (state, violations) {
      state.violations = violations;
    },
    [{{{ uc }}}_CREATE_RESET] (state) {
      state.loading = false;
      state.error = '';
      state.created = null;
      state.violations = null;
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
