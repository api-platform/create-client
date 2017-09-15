import {{{ lc }}}Fetch from '../../api/{{{ lc }}}Fetch';

const state = {
  loading: false,
  error: '',
  items: [],
  view: [],
  filters: {
    page: 1
  }
};

const getters = {};

const actions = {
    getItems({ commit, state }) {
      commit('{{{ uc }}}_LIST_LOADING', true);

      {{{ lc }}}Fetch('/{{{ name }}}', state.filters)
        .then(response => response.json())
        .then(data => {
          const items = data['{{{ hydraPrefix }}}member'];
          const view = data[];
          commit('{{{ uc }}}_LIST_LOADING', false);
          commit('{{{ uc }}}_LIST_SUCCESS', { items });
          commit('{{{ uc }}}_LIST_VIEW', { view });
        })
        .catch(e => {
          commit('{{{ uc }}}_LIST_LOADING', false);
          commit('{{{ uc }}}_LIST_ERROR', e.message);
        });
    }
};

const mutations = {
    ['{{{ uc }}}_LIST_ERROR'] (state, { error }) {
      state.error = error;
    },
    ['{{{ uc }}}_LIST_LOADING'] (state, { loading }) {
      state.loading = loading;
    },
    ['{{{ uc }}}_LIST_RESET'] (state) {
      state.items = [];
    },
    ['{{{ uc }}}_LIST_VIEW'] (state, { items }) {
      state.view = items;
    },
    ['{{{ uc }}}_LIST_SUCCESS'] (state, { items }) {
      state.items = items;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
