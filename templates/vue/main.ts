import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import bookRoutes from "./router/book";

bookRoutes.map((bookRoute) => {
  router.addRoute(bookRoute);
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
