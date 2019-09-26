export default (initState, types) => ({
  [types.RESET](state) {
    Object.assign(state, initState);
  },

  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.SET_RETRIEVED](state, retrieved) {
    Object.assign(state, { retrieved });
  },

  [types.TOGGLE_LOADING](state) {
    Object.assign(state, { isLoading: !state.isLoading });
  },
});
