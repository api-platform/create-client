import { getField, updateField } from 'vuex-map-fields';
import * as actions from './actions';
import mutations from './mutations';

export default {
  namespaced: true,
  state: {
    error: '',
    isLoading: false,
    items: [],
    selectItems: null,
    view: [],
  },
  actions,
  getters: {
    getField,
  },
  mutations: {
    updateField,
    ...mutations,
  }
};
