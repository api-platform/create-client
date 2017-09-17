import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';

const {{{ uc }}}_CREATE_ERROR = '{{{ uc }}}_CREATE_ERROR';
const {{{ uc }}}_CREATE_LOADING = '{{{ uc }}}_CREATE_LOADING';
const {{{ uc }}}_CREATE_SUCCESS = '{{{ uc }}}_CREATE_SUCCESS';

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

const getters = {};

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
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
