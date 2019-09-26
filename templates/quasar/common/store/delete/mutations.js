export default (initState, types) => ({
  [types.SET_DELETED](state, deleted) {
    Object.assign(state, { deleted });
  },

  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.TOGGLE_LOADING](state) {
    Object.assign(state, { isLoading: !state.isLoading });
  },

  [types.RESET](state) {
    Object.assign(state, initState);
  },
});
