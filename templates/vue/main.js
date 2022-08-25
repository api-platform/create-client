import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import book from './store/modules/book/';
import bookRoutes from './router/book';

Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store({
  modules: {
    book,
  }
});

const router = new VueRouter({
  mode: 'history',
  routes: [
    ...bookRoutes,
  ],
});

new Vue({
  store,
  router,
  render: (h) => h('div', { id: 'app' }, [h('router-view')])
}).$mount('#app')
