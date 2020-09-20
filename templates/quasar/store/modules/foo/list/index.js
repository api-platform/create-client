import actions from "./actions";
import * as getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import types from "./mutation_types";

export default {
  namespaced: true,
  state,
  actions: actions(types),
  getters,
  mutations: mutations(state, types)
};
