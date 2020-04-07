import config from '@/config'
import store from '@/store'
import crypto from 'crypto'
import NodeRSA from 'node-rsa'
import { Notification } from 'element-ui'
import { setStorage, getStorage, removeStorage, clearStorage } from './sessionStore'
import { checkPermission, routerAuth } from './auth'

// 跳转登录页，清除所有session的缓存
function go2Login () {
  clearStorage()
  location.href = config.PORTAL
}

// 回到主页，缓存只保留登录信息
function go2Home () {
  let user = getStorage('user')
  clearStorage()
  setStorage('user', user)
  location.href = config.PORTAL + '#/menu'
}

// rsa加密
function rsa (str) {
  let key = new NodeRSA(config.PUBLIC_KEY)
  key.setOptions({
    encryptionScheme: 'pkcs1'
  })
  return key.encrypt(str, 'hex')
}

// crypto
function sha256 (text) {
  let hash = crypto.createHash('sha256')
    .update(text)
    .digest('hex')
  return hash
}

// 提示信息（默认为成功）
function notify (message, type = 'success') {
  Notification({
    message: message,
    type: type
  })
}

// 是否显示 loading
function showLoading (flag) {
  store.commit('updateLoading', flag)
}

// token 过期提示
function lostTokenNotify () {
  notify('用户未登录或会话超时,请重新登录', 'error')
}

// 处理列表的分页查询参数
function handleQueryParam (queryForm, pageNo) {
  // 1.增加分页参数
  let queryParam = Object.assign({}, queryForm, {
    pageNo: pageNo,
    pageSize: config.DEFAULT_PAGE_SIZE
  })
  // 2.删除为空串的字段
  for (let key in queryParam) {
    if (queryParam[key] === '') {
      delete queryParam[key]
    }
  }
  return queryParam
}

// 字典数据从 array 转为 tree
function getDictTree () {
  const dictArray = getStorage('dict')
  let dictTree = {}
  // 如果没有字典，则返回空对象
  if (!dictArray) {
    return dictTree
  }
  Object.entries(dictArray).forEach(([key, val]) => {
    let option = {}
    val.forEach(item => {
      option[item.optionKey] = item.optionName
    })
    dictTree[key] = option
  })
  return dictTree
}

// 判断文件大小是否超过限制
function isFileOversize (file, size = config.MAX_FILE_SIZE) {
  return file.size / (1024 * 1024) > size
}

// 金额输入格式化
function amountFormat (val) {
  let tmp = ''
  if (val === tmp) return ''
  let ms = val.replace(/[^\d\\.]/g, '').replace(/(\.\d{2}).+$/, '$1').replace(/^0+([1-9])/, '$1').replace(/^0+$/, '0')
  if (ms === '') {
    ms = '0'
  }
  let txt = ms.split('.')
  while (/\d{4}(,|$)/.test(txt[0])) {
    txt[0] = txt[0].replace(/(\d)(\d{3}(,|$))/, '$1,$2')
  }
  tmp = txt[0] + (txt.length > 1 ? '.' + txt[1] : '')
  if (tmp.lastIndexOf('.') === -1) {
    tmp = tmp + '.00'
  }
  return tmp
}

export default {
  go2Login,
  go2Home,
  rsa,
  sha256,
  notify,
  showLoading,
  lostTokenNotify,
  isFileOversize,
  amountFormat,
  // sessionStore相关
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  // 创建分页查询参数
  handleQueryParam,
  // 获取字典树
  getDictTree,
  // 权限控制
  checkPermission,
  routerAuth
}
