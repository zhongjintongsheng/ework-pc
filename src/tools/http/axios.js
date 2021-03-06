import axios from 'axios'
import config from '@/config'
import util from '@/tools/util'
import http from '@/tools/http'
import _ from '@/tools/lib/lodash'

const lostTokenNotify = _.throttle(util.lostTokenNotify, 3000, { lending: true })

axios.defaults.baseURL = config.PORTAL + 'ework/'
axios.defaults.headers.common['If-Modified-Since'] = '0'
if (process.env.NODE_ENV === 'production') {
  axios.defaults.timeout = config.NETWORK_TIMEOUT
}

axios.interceptors.request.use(function (c) {
  let user = util.getStorage('user')
  if (user) {
    c.headers.common['x-token'] = user.token
  }
  return c
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  let { respCode } = response.data
  // 处理 token 过期
  if (respCode === config.LOST_TOKEN) {
    lostTokenNotify()
    if (process.env.NODE_ENV === 'development') {
      http.devLogin()
    } else {
      setTimeout(() => {
        util.go2Login()
      }, 1500)
    }
    return
  }
  return response
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 504:
        return Promise.reject(new Error('服务器网络异常，错误码 504'))
      case 404:
        return Promise.reject(new Error('资源不存在，错误码 404'))
    }
  }
  if (error.message.startsWith('timeout')) {
    return Promise.reject(new Error('连接超时，请检查网络环境或重试'))
  }
  return Promise.reject(new Error('系统异常，请联系管理员'))
})

export default axios
