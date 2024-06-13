/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

import { worker } from "@/mocks/browser";
worker.start();

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
