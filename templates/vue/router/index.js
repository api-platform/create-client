import Vue from 'vue'
import VueRouter from 'vue-router'
{{{importRoutes}}}

import HomeView from "../views/Home.vue";
import DashboardLayout from "../views/Layout/DashboardLayout.vue";

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: "/",
  routes: [
    {
      path: "/",
      component: DashboardLayout,
      redirect: "/home",
      name: "Home",
      children: [
        {
          path: "/",
          name: "home",
          component: HomeView,
        },
        {{{routesSpread}}}
      ],
    },
  ],
})

export default router;