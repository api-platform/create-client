import * as types from './mutation_types';
import initState from './state';

export default {
  [types.{{{uc}}}_SHOW_RESET](state) {
    Object.assign(state, initState);
  },

  [types.{{{uc}}}_SHOW_SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.{{{uc}}}_SHOW_SET_RETRIEVED](state, retrieved) {
    Object.assign(state, { retrieved });
  },

  [types.{{{uc}}}_SHOW_TOGGLE_LOADING](state) {
    Object.assign(state, { isLoading: !state.isLoading });
  },
};
