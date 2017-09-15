import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';

const {{{ uc }}}_SHOW_ERROR = '{{{ uc }}}_SHOW_ERROR';
const {{{ uc }}}_SHOW_LOADING = '{{{ uc }}}_SHOW_LOADING';
const {{{ uc }}}_SHOW_RETRIEVED_SUCCESS = '{{{ uc }}}_SHOW_RETRIEVED_SUCCESS';
const {{{ uc }}}_SHOW_RESET = '{{{ uc }}}_SHOW_RESET';

const state = {
  loading: false,
  error: '',
  retrieved: null
};

function error(commit, error) {
  return commit({{{ uc }}}_SHOW_ERROR, error);
}

function loading(commit, loading) {
  return commit({{{ uc }}}_SHOW_LOADING, loading);
}

function retrieved(commit, retrieved) {
  return commit({{{ uc }}}_SHOW_RETRIEVED_SUCCESS, retrieved);
}

const getters = {};

const actions = {
  retrieve({ commit }) {
    loading(commit, true);

    return {{{ lc }}}Fetch(id)
      .then(response => response.json())
      .then(data => {
        loading(commit, false);
        retrieved(commit, data);
      })
      .catch(e => {
        loading(commit, false);
        error(commit, e.message);
      });
  }
};

const mutations = {
    [{{{ uc }}}_SHOW_ERROR] (state, error) {
      state.error = error;
    },
    [{{{ uc }}}_SHOW_LOADING] (state, loading) {
      state.loading = loading;
    },
    [{{{ uc }}}_SHOW_RETRIEVED_SUCCESS] (state, retrieved) {
      state.retrieved = retrieved;
    },
    [{{{ uc }}}_SHOW_RESET] (state) {
      state.retrieved = null;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
