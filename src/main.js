import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import axios from 'axios';

const app = createApp(App);

app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

app.config.globalProperties.$axios = axios;

app.mount('#app');
