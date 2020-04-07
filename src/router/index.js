import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import util from '@/tools/util'
import NotFound from '@/views/home/404.vue'
import Home from '@/views/home/Home.vue'
import childRoute from './childRoute'

let routes = [
  {
    path: '/',
    component: Home,
    children: childRoute
  },
  {
    path: '/404',
    component: NotFound
  },
  {
    path: '*',
    component: NotFound
  }
]

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'hash',
  routes
})

NProgress.configure({ showSpinner: false })

if (process.env.NODE_ENV === 'production') {
  router.beforeEach((to, _from, next) => {
    NProgress.start()
    let user = util.getStorage('user')
    if (!user || to.path === '/login') {
      util.go2Login()
    } else if (to.path !== '/') {
      let flag = util.routerAuth(to.meta)
      if (!flag && (to.path !== '/404')) {
        router.replace('/404')
      }
      next()
    } else {
      next()
    }
  })
  router.afterEach(() => {
    NProgress.done()
  })
}

export default router
