import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes'
import './plugins'

createApp(App).mount('#app').config({
  router,
  // store,
  created () {
    // initStore()
  }
})
