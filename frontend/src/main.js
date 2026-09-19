import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index.js';
import toastPlugin from './plugins/toast.js';
import './styles/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(toastPlugin);

app.mount('#app');