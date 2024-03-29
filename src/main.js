import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import i18n from './i18n'
Vue.use(ElementUI)

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

process.on('uncaughtException', (error) => {
  Message({
    type: 'error',
    message: error.message
  })
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
