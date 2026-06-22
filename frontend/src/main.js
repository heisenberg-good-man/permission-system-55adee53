import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('[Vue Error]', info, err)
}

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
