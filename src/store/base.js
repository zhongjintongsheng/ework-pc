import apis from '@/apis'
import http from '@/tools/http'
import util from '@/tools/util'
import _ from '@/tools/lib/lodash'

const state = {
  // 进度条控制
  loading: false,
  // 视图标签
  viewTabs: [],
  // 当前打开又被被关闭的视图标签
  closedTabs: [],
  // 激活的菜单
  activeMenu: '',
  // 激活的Tab
  activeTab: '',
  // 是否有站内信
  hasNotice: {{ hasNotice }},
  // 刷新站内信
  refreshNotice: ''
}

const mutations = {
  updateLoading (state, loading) {
    state.loading = loading
  },
  addViewTab (state, tab) {
    state.viewTabs.push(tab)
  },
  updateViewTab (state, { index, currentPath }) {
    state.viewTabs[index].currentPath = currentPath
  },
  removeViewTab (state, index) {
    state.viewTabs.splice(index, 1)
  },
  clearViewTabs (state) {
    state.viewTabs = []
  },
  addClosedTab (state, tab) {
    state.closedTabs.push(tab)
  },
  removeClosedTab (state, index) {
    state.closedTabs.splice(index, 1)
  },
  updateActiveMenu (state, activeMenu) {
    state.activeMenu = activeMenu
  },
  updateActiveTab (state, activeTab) {
    state.activeTab = activeTab
  },
  refreshNotice: (state, data) => {
    state.refreshNotice = data
  }
}

const actions = {
  // 获取数据字典
  getDict () {
    if (!util.getStorage('dict') || _.isEmpty(util.getStorage('dict'))) {
      http.get({
        url: apis.dictList.getDictAll,
        loading: false,
        success: ({ data }) => {
          util.setStorage('dict', data)
        },
        fail: () => {
          util.setStorage('dict', {})
        }
      })
    }
  },
  // 获取按钮权限
  getPermission () {
    if (!util.getStorage('permission') || util.getStorage('permission').length === 0) {
      http.get({
        url: apis.base.getPermission,
        loading: false,
        success: ({ data }) => {
          util.setStorage('permission', data)
        },
        fail: () => {
          util.setStorage('permission', [])
        }
      })
    }
  }
}

const getters = {}

export default {
  actions,
  getters,
  state,
  mutations
}
