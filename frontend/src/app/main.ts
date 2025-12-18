import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "../router";
import PrimeVue from "primevue/config";
import "../styles/main.scss";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);

app.component("VueDatePicker", VueDatePicker);

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
app.use(Toast, {
  position: "top-right",
  timeout: 3500,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
});

app.use(ElementPlus);

app.mount("#app");
