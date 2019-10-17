import * as types from './mutation_types';

export default {
  [types.{{{uc}}}_SHOW_RESET](state) {
    Object.assign(state, {
      error: '',
      isLoading: false,
      retrieved: null,
    });
  },

  [types.{{{uc}}}_SHOW_SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.{{{uc}}}_SHOW_SET_RETRIEVED](state, retrieved) {
    Object.assign(state, { retrieved });
  },

  [types.{{{uc}}}_SHOW_TOGGLE_LOADING](state) {
    Object.assign(state, { error: '', isLoading: !state.isLoading });
  },
};
