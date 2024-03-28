import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './utils/router'

import 'element-plus/dist/index.css'
import './style.css'

const app = createApp(App)
const store = createPinia()

app.use(store).use(router).mount('#app')
