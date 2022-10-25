import Vue from 'vue'
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

{{{importLibs}}}

import store from './store'
import router from './router'


Vue.config.productionTip = false;

new Vue({
  store,
  router,
  {{{addLibs}}}
  render: h => h(App),
}).$mount('#app');