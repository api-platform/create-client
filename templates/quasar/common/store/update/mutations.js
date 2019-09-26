export default (initState, types) => ({
  [types.RESET](state) {
    Object.assign(state, initState);
  },

  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.TOGGLE_LOADING](state) {
    Object.assign(state, { isLoading: !state.isLoading });
  },

  [types.SET_RETRIEVED](state, retrieved) {
    Object.assign(state, { retrieved });
  },

  [types.SET_UPDATED](state, updated) {
    Object.assign(state, { error: '', updated, violations: null });
  },

  [types.SET_VIOLATIONS](state, violations) {
    Object.assign(state, { violations });
  },
});
