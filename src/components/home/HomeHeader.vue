<template>
  <div>
    <div class="wrap">
      <div class="left">
        <base-icon icon-class="menu" class="icon" @click.native="change"></base-icon>
        <img src="../../assets/images/logo.png" @click="go2Home" class="logo" />
      </div>
      <div class="middle">
        <div class="sysname">
          {{ $config.SYS_NAME }}
        </div>
      </div>
      <div class="right">
        <div class="user-dropdown" :class="{'has-notice' : $store.state.hasNotice}">
          <el-dropdown trigger="click">
            <div class="user">
              <span class="name">
                {{ username }}
              </span>
              <span class="icon">
                <base-icon icon-class="user"></base-icon>
              </span>
            </div>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item divided @click.native="updatePassword">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-if="$store.state.hasNotice">
          <keep-alive>
            <home-notice></home-notice>
          </keep-alive>
        </div>
      </div>
    </div>
    <!-- 修改密码模态框 -->
    <update-password-dialog ref="updatePasswordDialog"></update-password-dialog>
  </div>
</template>

<script>
import HomeNotice from './HomeNotice.vue'
import UpdatePasswordDialog from './UpdatePasswordDialog.vue'

export default {
  components: { HomeNotice, UpdatePasswordDialog },
  model: {
    prop: 'showMenu',
    event: 'change'
  },
  props: {
    showMenu: Boolean
  },
  computed: {
    username () {
      return this.$util.getStorage('user') ? this.$util.getStorage('user').name : '未登录'
    }
  },
  methods: {
    change () {
      this.$emit('change', !this.showMenu)
    },
    go2Home () {
      this.$util.go2Home()
    },
    logout () {
      this.$confirm('确认退出登录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$http.post({
          url: this.$apis.base.logout,
          success: () => {
            this.$util.go2Login()
          }
        })
      })
    },
    updatePassword () {
      this.$refs['updatePasswordDialog'].show()
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 50px;

.has-notice {
  padding-right: 55px;
}

.wrap {
  display: flex;
  border-bottom: solid 1px #e4e8f1;
  background: #f1f2f7;

  .left {
    flex-shrink: 0;
    height: $height;
    line-height: $height;
    width: 230px;

    .icon {
      font-size: 28px;
      margin: 10px 23px;
      cursor: pointer;
    }

    .logo {
      height: 40px;
      cursor: pointer;
    }
  }

  .middle {
    flex: 1;
    min-width: 300px;
    height: $height;
    line-height: $height;

    .sysname {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .right {
    flex-shrink: 0;
    width: 250px;
    height: $height;

    .user-dropdown {
      text-align: end;
      margin-right: 25px;
    }

    .user {
      display: flex;
      align-items: center;
      height: $height;
      cursor: pointer;

      .name {
        max-width: 130px;
        color: #20a0ff;
        text-align: end;
        margin-right: 7px;
        overflow: hidden;
        white-space: nowrap;
      }

      .icon {
        font-size: 32px;
        color: #20a0ff;
      }
    }
  }
}
</style>
