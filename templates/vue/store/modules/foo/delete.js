import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';

const {{{ uc }}}_DELETE_ERROR = '{{{ uc }}}_DELETE_ERROR';
const {{{ uc }}}_DELETE_LOADING = '{{{ uc }}}_DELETE_LOADING';
const {{{ uc }}}_DELETE_SUCCESS = '{{{ uc }}}_DELETE_SUCCESS';

const state = {
  loading: false,
  error: '',
  deleted: null
};

function error(commit, error) {
  return commit({{{ uc }}}_DELETE_ERROR, error);
}

function loading(commit, loading) {
  return commit({{{ uc }}}_DELETE_LOADING, loading);
}

function success(commit, deleted) {
  return commit({{{ uc }}}_DELETE_SUCCESS, deleted);
}

const getters = {};

const actions = {
  delete({ commit }) {
    loading(commit, true);

    return {{{ lc }}}Fetch(item['@id'], {method: 'DELETE'})
      .then(() => {
        loading(commit, false);
        success(commit, item);
      })
      .catch(e => {
        loading(commit, false);
        error(commit, e.message);
      });
  }
};

const mutations = {
    [{{{ uc }}}_DELETE_ERROR] (state, error) {
      state.error = error;
    },
    [{{{ uc }}}_DELETE_LOADING] (state, loading) {
      state.loading = loading;
    },
    [{{{ uc }}}_DELETE_SUCCESS] (state, deleted) {
      state.deleted = deleted;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
