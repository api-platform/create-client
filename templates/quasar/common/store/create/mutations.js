export default (initState, types) => ({
  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.TOGGLE_LOADING](state) {
    Object.assign(state, { isLoading: !state.isLoading });
  },

  [types.SET_CREATED](state, created) {
    Object.assign(state, { created });
  },

  [types.SET_VIOLATIONS](state, violations) {
    Object.assign(state, { violations });
  },

  [types.RESET](state) {
    Object.assign(state, initState);
  },
});
