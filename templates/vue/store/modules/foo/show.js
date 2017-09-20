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

function error(error) {
  return {type: {{{ uc }}}_SHOW_ERROR, error};
}

function loading(loading) {
  return {type: {{{ uc }}}_SHOW_LOADING, loading};
}

function retrieved(retrieved) {
  return {type: {{{ uc }}}_SHOW_RETRIEVED_SUCCESS, retrieved};
}

function reset() {
  return {type: {{{ uc }}}_SHOW_RESET};
}

const getters = {
  error: state => state.error,
  loading: state => state.loading,
  item: state => state.retrieved
};

const actions = {
  retrieve({ dispatch }, id) {
    dispatch(loading(true));

    return {{{ lc }}}Fetch(id)
      .then(response => response.json())
      .then(data => {
        dispatch(loading(false));
        dispatch(retrieved(data));
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));
      });
  },
  reset({ dispatch }) {
    dispatch(reset());
  }
};

const mutations = {
    [{{{ uc }}}_SHOW_ERROR] (state, payload) {
      state.error = payload.error;
    },
    [{{{ uc }}}_SHOW_LOADING] (state, payload) {
      state.loading = payload.loading;
    },
    [{{{ uc }}}_SHOW_RETRIEVED_SUCCESS] (state, payload) {
      state.retrieved = payload.retrieved;
    },
    [{{{ uc }}}_SHOW_RESET] (state) {
      state.retrieved = null;
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
