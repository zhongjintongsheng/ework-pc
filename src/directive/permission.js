import util from '@/tools/util'

export default {
  inserted (el, binding, vnode) {
    if (process.env.NODE_ENV === 'development') {
      return
    }
    let { value } = binding
    let permission = util.getStorage('permission')
    if (value && typeof value === 'string') {
      let authCode = value
      let hasPermission = permission && permission.includes(authCode)
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('权限不能为空')
    }
  }
}
