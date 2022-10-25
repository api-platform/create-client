import Vue from "vue";
import Vuex from "vuex";

{{{importModules}}}

Vue.use(Vuex)

export default new Vuex.Store({
  // register all apps modules
  modules: {
    {{{modulesSpread}}}
  }
});