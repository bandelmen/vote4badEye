import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import axios from 'axios';

// 使用环境变量来设置 API_BASE_URL
export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

const app = createApp(App);

app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

app.config.globalProperties.$axios = axios;

app.mount('#app');
