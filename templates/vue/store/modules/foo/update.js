import SubmissionError from '../../../error/SubmissionError';
import {{{ lc }}}Fetch from '../../../api/{{{ lc }}}Fetch';
import {
  {{{ uc }}}_UPDATE_RESET,
  {{{ uc }}}_UPDATE_UPDATE_ERROR,
  {{{ uc }}}_UPDATE_UPDATE_LOADING,
  {{{ uc }}}_UPDATE_UPDATE_SUCCESS,
  {{{ uc }}}_UPDATE_RETRIEVE_ERROR,
  {{{ uc }}}_UPDATE_RETRIEVE_LOADING,
  {{{ uc }}}_UPDATE_RETRIEVE_SUCCESS,
  {{{ uc }}}_UPDATE_UPDATE_VIOLATIONS
} from './mutation-types';

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

function retrieveError(retrieveError) {
  return {type: {{{ uc }}}_UPDATE_RETRIEVE_ERROR, retrieveError};
}

function retrieveLoading(retrieveLoading) {
  return {type: {{{ uc }}}_UPDATE_RETRIEVE_LOADING, retrieveLoading};
}

function retrieveSuccess(retrieved) {
  return {type: {{{ uc }}}_UPDATE_RETRIEVE_SUCCESS, retrieved};
}

function updateError(updateError) {
  return {type: {{{ uc }}}_UPDATE_UPDATE_ERROR, updateError};
}

function updateLoading(updateLoading) {
  return {type: {{{ uc }}}_UPDATE_UPDATE_LOADING, updateLoading};
}

function updateSuccess(updated) {
  return {type: {{{ uc }}}_UPDATE_UPDATE_SUCCESS, updated};
}

function violations(violations) {
  return {type: {{{ uc }}}_UPDATE_UPDATE_VIOLATIONS, violations};
}

function reset() {
  return {type: {{{ uc }}}_UPDATE_RESET};
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
  retrieve({ dispatch }, id) {
    dispatch(retrieveLoading(true));

    return {{{ lc }}}Fetch(id)
      .then(response => response.json())
      .then(data => {
        dispatch(retrieveLoading(false));
        dispatch(retrieveSuccess(data));
      })
      .catch(e => {
        dispatch(retrieveLoading(false));
        dispatch(retrieveError(e.message));
      });
  },
  update({ dispatch, state }, { item, values }) {
    dispatch(updateError(null));
    dispatch(updateLoading(true));

    return {{{ lc }}}Fetch(item['@id'], {
        method: 'PUT',
        headers: new Headers({'Content-Type': 'application/ld+json'}),
        body: JSON.stringify(values),
      }
    )
      .then(response => response.json())
      .then(data => {
        dispatch(updateLoading(false));
        dispatch(updateSuccess(data));
      })
      .catch(e => {
        dispatch(updateLoading(false));

        if (e instanceof SubmissionError) {
          dispatch(violations(e.errors));
          dispatch(updateError(e.errors._error));
          return;
        }

        dispatch(updateError(e.message));
      });
  },
  reset({ dispatch }) {
    dispatch(reset());
  }
};

const mutations = {
    [{{{ uc }}}_UPDATE_RETRIEVE_ERROR] (state, payload) {
      state.retrieveError = payload.retrieveError;
    },
    [{{{ uc }}}_UPDATE_RETRIEVE_LOADING] (state, payload) {
      state.retrieveLoading = payload.retrieveLoading;
    },
    [{{{ uc }}}_UPDATE_RETRIEVE_SUCCESS] (state, payload) {
      state.retrieved = payload.retrieved;
    },
    [{{{ uc }}}_UPDATE_UPDATE_LOADING] (state, payload) {
      state.updateLoading = payload.loading;
    },
    [{{{ uc }}}_UPDATE_UPDATE_ERROR] (state, payload) {
      state.updateError = payload.updateError;
    },
    [{{{ uc }}}_UPDATE_UPDATE_LOADING] (state, payload) {
      state.updateLoading = payload.updateLoading;
    },
    [{{{ uc }}}_UPDATE_UPDATE_SUCCESS] (state, payload) {
      state.updated = payload.updated;
      state.violations = null;
    },
    [{{{ uc }}}_UPDATE_UPDATE_VIOLATIONS] (state, payload) {
      state.violations = payload.violations;
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
