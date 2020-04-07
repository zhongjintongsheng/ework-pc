/**
 * 普通异步路由（自动生成）
 * 规则：路由地址（短横线）由组件名称（大驼峰）转换得到
 */
import components from './components'

const routes = []

function loadView (view) {
  return () => import(
    /* webpackChunkName: '[index]' */
    `@/views/${view}`
  )
}

// 驼峰转短横线 dictList => dict-list
function getKebabCase (str) {
  if (!str) return ''
  return str.replace(/[A-Z]/g, function (s, index) {
    if (!index) {
      return s.toLowerCase()
    }
    return '-' + s.toLowerCase()
  })
}

components.forEach(component => {
  let arr = component.split('/')
  let componentName = arr[arr.length - 1].replace(/(\.vue)/g, '')

  // 以组件所在目录名称(短横线)作为 group
  let group = getKebabCase(arr[arr.length - 2])
  let path = getKebabCase(componentName)

  routes.push({
    path,
    component: loadView(component),
    meta: {
      group
    }
  })
})

export default routes
