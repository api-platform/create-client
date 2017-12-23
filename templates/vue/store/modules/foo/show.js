import fetch from '../../../utils/fetch'

import {
  {{{ uc }}}_SHOW_ERROR,
  {{{ uc }}}_SHOW_LOADING,
  {{{ uc }}}_SHOW_RETRIEVED_SUCCESS,
  {{{ uc }}}_SHOW_RESET
} from './mutation-types'

const state = {
  loading: false,
  error: '',
  retrieved: null
}

function error (error) {
  return {type: {{{ uc }}}_SHOW_ERROR, error}
}

function loading (loading) {
  return {type: {{{ uc }}}_SHOW_LOADING, loading}
}

function retrieved (retrieved) {
  return {type: {{{ uc }}}_SHOW_RETRIEVED_SUCCESS, retrieved}
}

function reset () {
  return {type: {{{ uc }}}_SHOW_RESET}
}

const getters = {
  error: state => state.error,
  loading: state => state.loading,
  item: state => state.retrieved
}

const actions = {
  retrieve ({ commit }, id) {
    commit(loading(true))

    return fetch(id)
      .then(response => response.json())
      .then(data => {
        commit(loading(false))
        commit(retrieved(data))
      })
      .catch(e => {
        commit(loading(false))
        commit(error(e.message))
      });
  },
  reset ({ commit }) {
    commit(reset())
  }
};

const mutations = {
  [{{{ uc }}}_SHOW_ERROR] (state, payload) {
    state.error = payload.error
  },
  [{{{ uc }}}_SHOW_LOADING] (state, payload) {
    state.loading = payload.loading
  },
  [{{{ uc }}}_SHOW_RETRIEVED_SUCCESS] (state, payload) {
    state.retrieved = payload.retrieved
  },
  [{{{ uc }}}_SHOW_RESET] (state) {
    state.retrieved = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
