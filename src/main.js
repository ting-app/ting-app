import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import axios from './axios'

Vue.config.productionTip = false

Vue.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 2000
})

const newVue = () => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
}

try {
  const me = JSON.parse(localStorage.getItem('me'))

  if (me) {
    axios.get('/users/me')
      .then((response) => {
        store.commit('setMe', response)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        newVue()
      })
  } else {
    newVue()
  }
} catch (error) {
  newVue()
}
