import config from '@/config'

/**
 * 不鉴权接口
 */
export default {
  // 登录
  login: 'portal/login',
  // 退出登录
  logout: 'portal/logout',
  // 修改密码
  modifyPwd: 'portal/updatePwd',
  // 获取菜单
  getMenu: config.APPLICATION_NAME + '/' + 'portal/getMenu',
  // 获取按钮权限
  getPermission: config.APPLICATION_NAME + '/' + 'portal/getButtonPermissions',
  // 获取站内信列表
  getNoticeList: 'portal/getNoticeList',
  // 阅读站内信
  deal: 'portal/read',
  // 一键读所有站内信
  batchDeal: 'portal/batchRead'
}
