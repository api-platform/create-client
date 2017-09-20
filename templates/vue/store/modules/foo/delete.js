import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';
import {
  {{{ uc }}}_DELETE_ERROR,
  {{{ uc }}}_DELETE_LOADING,
  {{{ uc }}}_DELETE_SUCCESS,
  {{{ uc }}}_DELETE_RESET
} from './mutation-types';

const state = {
  loading: false,
  error: '',
  deleted: null
};

function error(error) {
  return {type: {{{ uc }}}_DELETE_ERROR, error};
}

function loading(loading) {
  return {type: {{{ uc }}}_DELETE_LOADING, loading};
}

function success(deleted) {
  return {type: {{{ uc }}}_DELETE_SUCCESS, deleted};
}

function reset() {
  return {type: {{{ uc }}}_DELETE_RESET};
}

const getters = {
  error: state => state.error,
  deleted: state => state.deleted,
  loading: state => state.loading,
};

const actions = {
  delete({ dispatch }, item) {
    dispatch(loading(true));

    return {{{ lc }}}Fetch(item['@id'], {method: 'DELETE'})
      .then(() => {
        dispatch(loading(false));
        dispatch(success(item));
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
    [{{{ uc }}}_DELETE_ERROR] (state, payload) {
      state.error = payload.error;
    },
    [{{{ uc }}}_DELETE_LOADING] (state, payload) {
      state.loading = payload.loading;
    },
    [{{{ uc }}}_DELETE_SUCCESS] (state, payload) {
      state.deleted = payload.deleted;
    },
    [{{{ uc }}}_DELETE_RESET] (state) {
      state.error = '';
      state.loading = false;
      state.deleted = null;
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
