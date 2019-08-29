import Vue from 'vue'
import axios from 'axios'
import vuetify from './plugins/vuetify'
import '@fortawesome/fontawesome-free/css/all.css'
import App from './App'
import router from './router'
import store from './store'

import Notifications from 'vue-notification'
import velocity from 'velocity-animate'

Vue.use(Notifications, { velocity })

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  vuetify,
  template: '<App/>'
}).$mount('#app')
