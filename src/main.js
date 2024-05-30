import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ContextMenu from '@imengyu/vue3-context-menu'

import App from './App.vue'
import router from './utils/router'

import 'element-plus/dist/index.css'
import '@icon-park/vue-next/styles/index.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import './style.css'

const app = createApp(App)
const store = createPinia()

app.use(store).use(router).use(ContextMenu).mount('#app')
