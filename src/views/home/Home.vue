<template>
  <div class="home-wrap">
    <!-- 顶部区域 -->
    <home-header v-model="showMenu"></home-header>
    <div class="home-main">
      <!-- 左侧菜单导航 -->
      <home-menu :showMenu="showMenu" @menu-complete="handleNotice"></home-menu>
      <div class="home-content" :style="contentLeft">
        <!-- 导航页签 -->
        <home-tab></home-tab>
        <div class="content-container">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>
    <div class="footer">
      <h5>版权所有 ©2017 中金同盛商业保理有限公司</h5>
    </div>
  </div>
</template>

<script>
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeMenu from '@/components/home/HomeMenu.vue'
import HomeTab from '@/components/home/HomeTab.vue'

export default {
  components: { HomeHeader, HomeMenu, HomeTab },
  data () {
    return {
      // 是否展示左侧导航菜单
      showMenu: true
    }
  },
  computed: {
    menuShow () {
      return this.showMenu ? {} : {
        transform: 'translate3d(-100%,0,0)',
        visibility: 'hidden'
      }
    },
    contentLeft () {
      return this.showMenu ? {} : {
        paddingLeft: '0',
        transition: 'all .45s cubic-bezier(.23,1,.32,1)'
      }
    }
  },
  methods: {
    handleNotice () {
      if (this.$store.state.hasNotice) {
        let redirect = this.$route.query.redirect
        if (redirect) {
          let path = redirect.split('?')[0]
          let query = {}
          let params = redirect.split('?')[1].split('&')
          params.forEach(item => {
            query[item.split('=')[0]] = item.split('=')[1]
          })
          this.$router.push({ path, query })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .home-wrap {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    justify-content: space-between;

    .home-main {
      flex: 1;
      min-width: 0;
      min-height: 0;
      position: relative;
      display: flex;

      .home-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        padding-left: 230px;
        padding-bottom: 39px;
        transition: all .45s cubic-bezier(.23, 1, .32, 1);

        .content-container {
          position: relative;
          overflow: auto;
        }
      }
    }

    .footer {
      height: 40px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #f1f2f7;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
