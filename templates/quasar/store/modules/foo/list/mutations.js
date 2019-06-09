import * as types from './mutation_types';

export default {
  [types.RESET](state) {
    Object.assign(state, {
      error: '',
      isLoading: false,
      items: [],
      view: [],
      totalItems: 10,
    });
  },

  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.SET_ITEMS](state, items) {
    Object.assign(state, { items });
  },

  [types.TOGGLE_LOADING](state) {
    Object.assign(state, { isLoading: !state.isLoading });
  },

  [types.SET_VIEW](state, view) {
    Object.assign(state, { view });
  },

  [types.SET_TOTALITEMS](state, totalItems) {
    Object.assign(state, { totalItems });
  },
};
