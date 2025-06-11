import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "./styles/main.scss";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});

app.use(createPinia());
app.use(router);

app.mount("#app");
