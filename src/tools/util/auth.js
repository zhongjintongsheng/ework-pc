import { getStorage } from './sessionStore'
import _ from '@/tools/lib/lodash'

// 控制表格的操作列是否显示
export function checkPermission (authCodeArr) {
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  if (authCodeArr && authCodeArr instanceof Array) {
    let permission = getStorage('permission')
    return permission && _.intersection(authCodeArr, permission).length > 0
  } else {
    throw new Error(`need authCodeArr!`)
  }
}

// 控制路由权限
export function routerAuth (meta) {
  return getStorage('leafMenus').some(menu => menu.href === meta.group)
}
