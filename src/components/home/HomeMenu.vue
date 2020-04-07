<template>
  <el-menu :default-active="$store.state.activeMenu" @select="menuSelect" :style="menuShow" background-color="#f1f2f7" class="menu">
    <home-menu-item :menus="menus"></home-menu-item>
  </el-menu>
</template>

<script>
import devMenus from '@/assets/json/menus.json'
import HomeMenuItem from './HomeMenuItem.vue'

export default {
  components: { HomeMenuItem },
  props: {
    showMenu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      menus: []
    }
  },
  computed: {
    menuShow () {
      return this.showMenu ? {} : {
        transform: 'translate3d(-100%,0,0)',
        visibility: 'hidden'
      }
    }
  },
  watch: {
    $route () {
      this.updateActiveMenu()
    }
  },
  mounted () {
    this.getMenu()
    this.updateActiveMenu()
  },
  methods: {
    getMenu () {
      if (process.env.NODE_ENV === 'production') {
        let menus = this.$util.getStorage('menus')
        if (menus && menus.length) {
          this.menus = menus
        } else {
          this.$http.get({
            url: this.$apis.base.getMenu,
            success: ({ data }) => {
              this.handleMenu(data)
              this.menus = data
              this.$util.setStorage('menus', this.menus)
              // 获取所有叶子菜单
              this.getLeafMenus(this.menus)
              this.$emit('menu-complete')
            }
          })
        }
      } else {
        this.handleMenu(devMenus)
        this.menus = devMenus
        this.$util.setStorage('menus', this.menus)
        // 获取所有叶子菜单
        this.getLeafMenus(this.menus)
      }
    },
    // 处理菜单数据
    handleMenu (menus) {
      if (!menus) {
        return
      }
      menus.forEach(menu => {
        // id 用作 v-for 的 key(和 index)
        menu.id = menu.id || Math.random().toString(36).substring(2)
        // 如果有下级菜单，使用自己的图标（或者默认图标）
        if (menu.children && menu.children.length) {
          menu.icon = menu.icon || 'menu-default'
          this.handleMenu(menu.children)
        } else {
          // 叶子菜单，使用 right-circled 图标（或者默认图标）
          menu.icon = menu.icon || 'right-circled'
        }
      })
    },
    handleLeafMenu (menus, leafMenus) {
      menus.forEach(menu => {
        if (menu.children && menu.children.length) {
          this.handleLeafMenu(menu.children, leafMenus)
        } else {
          leafMenus.push(menu)
        }
      })
    },
    getLeafMenus (menus) {
      let leafMenus = []
      if (menus && menus.length) {
        this.handleLeafMenu(menus, leafMenus)
      }
      this.$util.setStorage('leafMenus', leafMenus)
    },
    menuSelect (href) {
      if (this.$store.state.viewTabs.length) {
        let path = this.$store.state.viewTabs[this.$store.state.activeTab].currentPath
        if ('/' + href === path) {
          return
        }
      }
      this.$router.push(href)
    },
    updateActiveMenu () {
      let routeGroup = this.$route.meta.group
      if (this._.isEmpty(routeGroup)) {
        return
      }
      this.$store.commit('updateActiveMenu', routeGroup)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  width: 230px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  overflow: auto;
  transition-duration: .45s;
  z-index: 200;
}
</style>
