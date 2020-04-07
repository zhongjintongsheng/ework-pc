import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import EworkUI from 'ework-ui'

import permission from '@/directive/permission'
import apis from '@/apis'
import http from '@/tools/http'
import config from '@/config'
import util from '@/tools/util'
import _ from '@/tools/lib/lodash'

import '@/assets/icons'
import '@/styles/styles.scss'

Vue.config.productionTip = false

// 阻止页面后退
window.addEventListener('popstate', () => {
  history.pushState(null, null, document.URL)
})

// 权限指令
Vue.directive('permission', permission)

// 全局组件
Vue.use(ElementUI, { size: 'small' })
Vue.use(EworkUI)

// 全局变量
Vue.prototype.$apis = apis
Vue.prototype.$http = http
Vue.prototype.$config = config
Vue.prototype.$util = util
Vue.prototype._ = _

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
