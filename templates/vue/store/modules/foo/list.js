import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';
import {
  {{{ uc }}}_LIST_ERROR,
  {{{ uc }}}_LIST_LOADING,
  {{{ uc }}}_LIST_RESET,
  {{{ uc }}}_LIST_VIEW,
  {{{ uc }}}_LIST_SUCCESS
} from './mutation-types';

const state = {
  loading: false,
  error: '',
  items: [],
  view: []
};

function error(error) {
  return {type: {{{ uc }}}_LIST_ERROR, error};
}

function loading(loading) {
  return {type: {{{ uc }}}_LIST_LOADING, loading};
}

function success(items) {
  return {type: {{{ uc }}}_LIST_SUCCESS, items};
}

function view(items) {
  return { type: {{{ uc }}}_LIST_VIEW, items};
}

const getters = {
  items: state => state.items,
  view: state => state.view
};

const actions = {
    getItems({ dispatch }) {
      dispatch(loading(true));

      {{{ lc }}}Fetch('/{{{ name }}}')
        .then(response => response.json())
        .then(data => {
          dispatch(loading(false));
          dispatch(success(data['{{{ hydraPrefix }}}member']));
          dispatch(view(data['{{{ hydraPrefix }}}view']));
        })
        .catch(e => {
          dispatch(loading(false));
          dispatch(error(e.message));
        });
    }
};

const mutations = {
    [{{{ uc }}}_LIST_ERROR] (state, payload) {
      state.error = payload.error;
    },
    [{{{ uc }}}_LIST_LOADING] (state, payload) {
      state.loading = payload.loading;
    },
    [{{{ uc }}}_LIST_VIEW] (state, payload) {
      state.view = payload.items;
    },
    [{{{ uc }}}_LIST_SUCCESS] (state, payload) {
      state.items = payload.items;
    },
    [{{{ uc }}}_LIST_RESET] (state) {
      state.items = [];
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
