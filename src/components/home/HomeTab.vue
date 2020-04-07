<template>
  <div>
    <div class="tabs-wrap">
      <el-tabs v-model="$store.state.activeTab" @tab-click="tabClick" @tab-remove="tabRemove"
        @contextmenu.prevent.native="contextmenu" closable>
        <el-tab-pane v-for="(item, index) in viewTabs" :key="index" :name="index + ''" :label="item.label">
        </el-tab-pane>
      </el-tabs>
    </div>
    <ul v-show="showContextmenu" :style="{ left: contextmenuLeft + 'px', top: contextmenuTop + 'px' }"
      class="contextmenu">
      <li @click="closeCurrent">关闭</li>
      <li @click="closeOthers">关闭其它</li>
      <li @click="closeAll">关闭所有</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 右键菜单相关
      showContextmenu: false,
      // 右键点击的tab
      targetTab: '',
      contextmenuTop: 0,
      contextmenuLeft: 0
    }
  },
  computed: {
    viewTabs () {
      return this.$store.state.viewTabs
    }
  },
  watch: {
    $route () {
      this.updateActiveTab()
    },
    showContextmenu (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted () {
    this.updateActiveTab()
  },
  methods: {
    updateActiveTab () {
      let routeGroup = this.$route.meta.group
      if (this._.isEmpty(routeGroup)) {
        return
      }
      let viewTab = this._.find(this.$store.state.viewTabs, ['routeGroup', routeGroup])
      if (viewTab) {
        let activeTab = this._.findIndex(this.$store.state.viewTabs, ['routeGroup', routeGroup]) + ''
        this.$store.commit('updateActiveTab', activeTab)
        // 更新currentPath
        this.$store.commit('updateViewTab', { index: activeTab, currentPath: this.$route.fullPath })
        return
      }
      let label = this._.find(this.$util.getStorage('leafMenus'), ['href', routeGroup]).name
      let tab = {
        currentPath: this.$route.fullPath,
        label,
        routeGroup
      }
      this.$store.commit('addViewTab', tab)
      let activeTab = this.$store.state.viewTabs.length - 1 + ''
      this.$store.commit('updateActiveTab', activeTab)
    },
    tabClick (component) {
      let path = this.$store.state.viewTabs[component.index].currentPath
      if (path.startsWith(this.$route.path)) {
        return
      }
      this.$router.push(path)
    },
    tabRemove (index) {
      // 增加关闭的 tab
      this.$store.commit('addClosedTab', this.$store.state.viewTabs[index])
      // 只有一个tab
      if (this.$store.state.viewTabs.length === 1) {
        this.$router.push('/')
        this.$store.commit('removeViewTab', index)
        this.$store.commit('updateActiveMenu', '')
        this.$store.commit('updateActiveTab', '')
        return
      }
      let activeTab = this.$store.state.activeTab
      // index在activedTab之前
      if (index < activeTab) {
        this.$store.commit('updateActiveTab', (activeTab - 1) + '')
        this.$store.commit('removeViewTab', index)
        return
      }
      // index在activedTab之后
      if (index > activeTab) {
        this.$store.commit('removeViewTab', index)
        return
      }
      // index等于activedTab并且是最后一个tab
      if (Number(index) === this.$store.state.viewTabs.length - 1) {
        this.$store.commit('removeViewTab', index)
        this.$router.push(this.$store.state.viewTabs[index - 1].currentPath)
        return
      }
      this.$store.commit('removeViewTab', index)
      this.$router.push(this.$store.state.viewTabs[activeTab].currentPath)
    },
    contextmenu (event) {
      if (!event.target.id) {
        return
      }
      // 获取点击的tab序号
      this.targetTab = event.target.id.split('-')[1]
      this.contextmenuLeft = event.clientX
      this.contextmenuTop = event.offsetY
      this.showContextmenu = true
    },
    closeMenu () {
      this.showContextmenu = false
    },
    closeCurrent () {
      this.tabRemove(this.targetTab)
    },
    closeOthers () {
      let tab = this.$store.state.viewTabs[this.targetTab]
      this.$store.commit('clearViewTabs')
      this.$store.commit('addViewTab', tab)
      // 在当前激活的tab上点击
      if (this.targetTab === this.$store.state.activeTab) {
        this.$store.commit('updateActiveTab', '0')
        return
      }
      this.$router.push(tab.currentPath)
    },
    closeAll () {
      this.$store.commit('clearViewTabs')
      this.$router.push('/')
      this.$store.commit('updateActiveMenu', '')
      this.$store.commit('updateActiveTab', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-wrap {
  position: relative;
  padding: 0 10px;
  /* 兼容IE，设置height属性为auto */
  height: auto;
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 100;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .1), -2px -2px 3px 0 rgba(0, 0, 0, .1);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}
</style>
