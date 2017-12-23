import fetch from '../../../utils/fetch'

import {
  {{{ uc }}}_DELETE_ERROR,
  {{{ uc }}}_DELETE_LOADING,
  {{{ uc }}}_DELETE_SUCCESS,
  {{{ uc }}}_DELETE_RESET
} from './mutation-types'

const state = {
  loading: false,
  error: '',
  deleted: null
}

function error (error) {
  return {type: {{{ uc }}}_DELETE_ERROR, error}
}

function loading (loading) {
  return {type: {{{ uc }}}_DELETE_LOADING, loading}
}

function success (deleted) {
  return {type: {{{ uc }}}_DELETE_SUCCESS, deleted}
}

function reset () {
  return {type: {{{ uc }}}_DELETE_RESET}
}

const getters = {
  error: state => state.error,
  deleted: state => state.deleted,
  loading: state => state.loading
}

const actions = {
  delete ({ commit }, item) {
    commit(loading(true))

    return fetch(item['@id'], {method: 'DELETE'})
      .then(() => {
        commit(loading(false))
        commit(success(item))
      })
      .catch(e => {
        commit(loading(false))
        commit(error(e.message))
      })
  },
  reset ({ commit }) {
    commit(reset())
  }
}

const mutations = {
  [{{{ uc }}}_DELETE_ERROR] (state, payload) {
    state.error = payload.error
  },
  [{{{ uc }}}_DELETE_LOADING] (state, payload) {
    state.loading = payload.loading
  },
  [{{{ uc }}}_DELETE_SUCCESS] (state, payload) {
    state.deleted = payload.deleted
  },
  [{{{ uc }}}_DELETE_RESET] (state) {
    state.error = ''
    state.loading = false
    state.deleted = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
