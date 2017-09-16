import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';

const {{{ uc }}}_LIST_ERROR = '{{{ uc }}}_LIST_ERROR';
const {{{ uc }}}_LIST_LOADING = '{{{ uc }}}_LIST_LOADING';
const {{{ uc }}}_LIST_RESET = '{{{ uc }}}_LIST_RESET';
const {{{ uc }}}_LIST_VIEW = '{{{ uc }}}_LIST_VIEW';
const {{{ uc }}}_LIST_SUCCESS = '{{{ uc }}}_LIST_SUCCESS';

const state = {
  loading: false,
  error: '',
  items: [],
  view: [],
  filters: {
    page: 1
  }
};

function error(commit, error) {
  return commit({{{ uc }}}_LIST_ERROR, error);
}

function loading(commit, loading) {
  return commit({{{ uc }}}_LIST_LOADING, loading);
}

function success(commit, items) {
  return commit({{{ uc }}}_LIST_SUCCESS, items);
}

function view(commit, items) {
  return commit({{{ uc }}}_LIST_VIEW, items);
}

function reset(commit) {
  return commit({{{ uc }}}_LIST_RESET);
}

const getters = {
  items: state => state.items,
  view: state => state.view
};

const actions = {
    getItems({ commit, state }) {
      loading(commit, true);

      {{{ lc }}}Fetch('/{{{ name }}}', state.filters)
        .then(response => response.json())
        .then(data => {
          loading(commit, false);
          success(commit, data['{{{ hydraPrefix }}}member']);
          view(commit, data['{{{ hydraPrefix }}}view']);
        })
        .catch(e => {
          loading(commit, false);
          error(commit, e.message);
        });
    }
};

const mutations = {
    [{{{ uc }}}_LIST_ERROR] (state, error) {
      state.error = error;
    },
    [{{{ uc }}}_LIST_LOADING] (state, loading) {
      state.loading = loading;
    },
    [{{{ uc }}}_LIST_RESET] (state) {
      state.items = [];
    },
    [{{{ uc }}}_LIST_VIEW] (state, items) {
      state.view = items;
    },
    [{{{ uc }}}_LIST_SUCCESS] (state, items) {
      state.items = items;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
