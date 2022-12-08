import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import bookRoutes from "./router/book";
import reviewRoutes from "./router/review";

bookRoutes.map((bookRoute) => {
  router.addRoute(bookRoute);
});
reviewRoutes.map((reviewRoute) => {
  router.addRoute(reviewRoute);
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
