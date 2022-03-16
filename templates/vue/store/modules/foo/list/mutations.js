import * as types from './mutation_types';

export default {
  [types.RESET](state) {
    Object.assign(state, {
      error: '',
      isLoading: false,
      items: [],
      selectItems: null,
      view: [],
    });
  },

  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.SET_ITEMS](state, items) {
    Object.assign(state, {
      error: '',
      items,
    });
  },

  [types.SET_SELECT_ITEMS](state, selectItems) {
    Object.assign(state, { selectItems });
  },

  [types.TOGGLE_LOADING](state) {
    Object.assign(state, { isLoading: !state.isLoading });
  },

  [types.SET_VIEW](state, view) {
    Object.assign(state, { view });
  },
};
