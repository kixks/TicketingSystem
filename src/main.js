import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

import App from './App.vue'
import router from './router'

import axios from 'axios';
axios.defaults.baseURL = "http://127.0.0.1:8000/api";
axios.defaults.headers.common["Accept"] = "application/json";
const token = localStorage.getItem("token");
if(token){
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
export default axios;

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
