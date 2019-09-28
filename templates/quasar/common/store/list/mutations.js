export default (initState, types) => ({
  [types.RESET](state) {
    Object.assign(state, initState);
  },

  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.SET_ITEMS](state, items) {
    Object.assign(state, { items });
  },

  [types.SET_SELECT_ITEMS](state, selectItems) {
    Object.assign(state, { selectItems });
  },

  [types.SET_SELECT_ITEMS_TEMPLATE](state, selectItemsTemplate) {
    Object.assign(state, { selectItemsTemplate });
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
});
