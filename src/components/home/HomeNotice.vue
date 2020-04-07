<template>
  <div class="notice">
    <el-badge :value="unreadList.totalElements" class="notice-logo" v-if="unreadList.totalElements > 0">
      <base-icon icon-class="notice" class="notice-logo-img" @click.native="showNoticeBox"></base-icon>
    </el-badge>
    <div v-else class="notice-logo">
      <base-icon icon-class="notice" class="notice-logo-img" @click.native="showNoticeBox"></base-icon>
    </div>
    <div class="notice-cell-box" @click="hiddenNoticeBox" v-show="isActive"></div>
    <transition name="slide">
      <div class="notice-contain" v-show="showNotice" v-loading="loading">
        <div class="notice-contain-title">
          <span>站内消息通知</span>
          <el-button v-if="activeName === 'unread' && unreadList.content.length > 0" style="margin-left: 10px;"
            type="success" size="mini" @click="readAll">一键已读</el-button>
        </div>
        <el-tabs stretch v-model="activeName" type="border-card" @tab-click="handleClick" class="notice-contain-tabs">
          <el-tab-pane name="unread" class="notice-contain-tabs-pane">
            <span slot="label">
              未读
              <el-badge v-if="unreadList.totalElements !== 0" :value="unreadList.totalElements" class="item"></el-badge>
            </span>
            <div class="ssss">
              <div class="notice-contain-tabs-pane-content" ref="unreadBoxs">
                <div v-if="unreadList.content.length === 0" style="margin-left: 20px;">
                  没有未读消息！
                </div>
                <div class="notice-contain-tabs-pane-content-card" v-for="item in unreadList.content" :key="item.index">
                  <span class="notice-contain-tabs-pane-content-card-title">{{ item.noticeTitle }}</span>
                  <span class="notice-contain-tabs-pane-content-card-content">{{ item.noticeContent }}</span>
                  <span class="notice-contain-tabs-pane-content-card-time">{{ item.createTime }}</span>
                  <el-button size="mini" class="notice-contain-tabs-pane-content-card-handle" type="success"
                    @click="readNotice(item)" v-if="item.noticeType === '01'">知道了
                  </el-button>
                  <el-button v-if="item.noticeType === '02'" size="mini"
                    class="notice-contain-tabs-pane-content-card-handle" @click="dealNotice(item)" type="danger">详情
                    <i class="el-icon-arrow-right el-icon--right"></i>
                  </el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="read" label="已读" class="notice-contain-tabs-pane">
            <div class="notice-contain-tabs-pane-content" ref="readBox">
              <div v-if="readList.content.length === 0" style="margin-left: 20px;">
                没有已读消息！
              </div>
              <div class="notice-contain-tabs-pane-content-card" v-for="item in readList.content" :key="item.index">
                <span class="notice-contain-tabs-pane-content-card-title"
                  style="font-weight: 500;">{{ item.noticeTitle }}</span>
                <span class="notice-contain-tabs-pane-content-card-content"
                  style="color: #95D2FF;">{{ item.noticeContent }}</span>
                <span class="notice-contain-tabs-pane-content-card-time">{{ item.createTime }}</span>
                <el-button v-if="item.noticeType === '02'" size="mini"
                  class="notice-contain-tabs-pane-content-card-handle" @click="dealNotice(item)" type="success">详情
                  <i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="notice-contain-pagination">
          <el-pagination v-if="activeName === 'unread'" background small :pager-count="5"
            layout="total, prev, pager, next, jumper" :total="unreadList.totalElements"
            @current-change="handleCurrentUnreadChange" :current-page="currentUnreadPage"
            :page-size="$config.DEFAULT_PAGE_SIZE">
          </el-pagination>
          <el-pagination v-else background small :pager-count="5" layout="total, prev, pager, next, jumper"
            :total="readList.totalElements" @current-change="handleCurrentReadChange" :current-page="currentReadPage"
            :page-size="$config.DEFAULT_PAGE_SIZE">
          </el-pagination>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 未读消息
      unreadList: {
        content: [],
        totalElements: 0
      },
      currentUnreadPage: 1,
      // 已读消息
      readList: {
        content: [],
        totalElements: 0
      },
      currentReadPage: 1,
      sysList: [],
      isActive: false,
      showNotice: false,
      loading: false,
      appId: '',
      activeName: 'unread'
    }
  },
  activated () {
    this.activeName = 'unread'
    this.queryUnreadNoticeList(1)
  },
  methods: {
    // 用于列表置顶
    initData () {
      this.unreadList.content = []
      this.readList.content = []
    },
    showNoticeBox () {
      this.activeName = 'unread'
      this.isActive = !this.isActive
      this.showNotice = !this.showNotice
      this.initData()
      this.queryUnreadNoticeList(1)
    },
    handleClick (tab) {
      this.initData()
      if (tab.name === 'unread') {
        this.queryUnreadNoticeList(1)
        return
      }
      this.queryReadList(1)
    },
    // 隐藏站内信
    hiddenNoticeBox () {
      this.isActive = !this.isActive
      this.showNotice = !this.showNotice
      this.appId = ''
      this.queryUnreadNoticeList(1)
    },
    queryUnreadNoticeList (pageNo = this.currentUnreadPage) {
      this.currentUnreadPage = pageNo
      this.loading = true
      let param = {
        appId: this.$config.APPLICATION_NAME,
        noticeStatus: '01'
      }
      param = this.$util.handleQueryParam(param, this.currentUnreadPage)
      this.$http.get({
        url: this.$apis.base.getNoticeList,
        param,
        loading: false,
        success: ({ data }) => {
          this.unreadList = data
          this.loading = false
        }
      })
    },
    handleCurrentUnreadChange (val) {
      if (this.currentUnreadPage === val) {
        return
      }
      this.currentUnreadPage = val
      this.queryUnreadNoticeList()
    },
    queryReadList (pageNo = this.currentReadPage) {
      this.currentReadPage = pageNo
      this.loading = true
      let param = {
        appId: this.$config.APPLICATION_NAME,
        noticeStatus: '02'
      }
      param = this.$util.handleQueryParam(param, this.currentReadPage)
      this.$http.get({
        url: this.$apis.base.getNoticeList,
        param,
        loading: false,
        success: ({ data }) => {
          this.readList = data
          this.loading = false
        }
      })
    },
    handleCurrentReadChange (val) {
      if (this.currentReadPage === val) {
        return
      }
      this.currentReadPage = val
      this.queryReadList()
    },
    // 阅读站内信
    readNotice (obj) {
      this.$http.post({
        url: this.$apis.base.deal,
        param: { noticeId: obj.noticeId },
        loading: false,
        success: () => {
          this.queryUnreadNoticeList()
        }
      })
    },
    // 处理站内信
    dealNotice (obj) {
      let url = obj.noticeLink
      if (obj.noticeStatus === '02') {
        this.handleRequest(url)
      } else {
        let param = {
          noticeId: obj.noticeId
        }
        this.$http.post({
          url: this.$apis.base.deal,
          param,
          success: ({ data }) => {
            this.handleRequest(url)
            this.queryUnreadNoticeList()
          }
        })
      }
      this.isActive = false
      this.showNotice = false
    },
    handleRequest (url) {
      this.$http.get({
        url: this.$config.APPLICATION_NAME + url,
        success: ({ data }) => {
          let path = data.url.split('?')[0]
          let query = {}
          let params = data.url.split('?')[1].split('&')
          params.forEach(item => {
            query[item.split('=')[0]] = item.split('=')[1]
          })
          this.$router.push({ path, query })
        }
      })
    },
    // 一键已读
    readAll () {
      let param = {
        appId: this.$config.APPLICATION_NAME
      }
      this.loading = true
      this.$http.post({
        url: this.$apis.base.batchDeal,
        loading: false,
        param,
        success: ({ data }) => {
          this.queryUnreadNoticeList()
        },
        complete: () => {
          this.loading = false
        }
      })
    }
  },
  watch: {
    '$store.state.refreshNotice' (val, old) {
      this.queryUnreadNoticeList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .notice {
    &-logo {
      position: absolute;
      top: 10px;
      right: 25px;
      line-height: normal;

      &-img {
        font-size: 28px;
        color: #0093FF;
        cursor: pointer;
      }
    }

    &-cell-box {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1000;
      width: 100%;
      height: 1000px;
      opacity: 1;
    }

    &-contain {
      width: 430px;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #F9FAFC;
      box-shadow: -3px 0 10px #C0C0C0;
      border: gray;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 1001;

      &-title {
        width: 100%;
        font-size: 16px;
        text-align: left;
        color: #000000;
        margin: 10px auto;
        margin-left: 10px;
        line-height: 30px;
      }

      &-tabs {
        height: calc(100% - 100px);

        &-pane {
          height: calc(100% - 60px);
          overflow-y: auto;
          overflow-x: hidden;

          &-content {
            &-card {
              width: 98%;
              height: auto;
              margin: auto;
              margin-bottom: 7px;
              padding-top: 5px;
              padding-bottom: 5px;
              line-height: 20px;
              border-radius: 3px;
              border-bottom: solid 1px #c8c8c8;
              box-shadow: 1px 0px 5px #888888;

              &-time {
                display: block;
                color: #000;
                font-size: 15px;
                font-weight: 500;
                padding-left: 8px;
                margin-top: 5px;
              }

              &-title {
                display: block;
                color: #000;
                font-size: 15px;
                font-weight: 600;
                margin-top: 10px;
                padding-left: 8px;
              }

              &-content {
                display: block;
                letter-spacing: 1px;
                padding: 5px 10px 0 8px;
                width: 97%;
                font-size: 14px;
                word-wrap: break-word;
                word-break: break-all;
                overflow: auto;
                color: #0093FF;
              }

              &-handle {
                margin-left: 300px;
              }
            }

            &-card:first-child {
              margin-top: 10px;
            }

            &-card:last-child {
              margin-bottom: 15px;
            }
          }
        }
      }

      &-pagination {
        text-align: center;
        margin-top: 20px;
        height: 40px;
        z-index: 999;
      }
    }

    &-contain.slide-enter {
      right: -385px;
    }

    &-contain.slide-enter-active {
      -webkit-transition: all 1s;
      -moz-transition: all 1s;
      -ms-transition: all 1s;
      -o-transition: all 1s;
      transition: all 1s;
    }

    &-contain.slide-enter-to {
      right: 0px;
    }

    &-contain.slide-leave {
      right: 0px;
    }

    &-contain.slide-leave-active {
      -webkit-transition: all 1s;
      -moz-transition: all 1s;
      -ms-transition: all 1s;
      -o-transition: all 1s;
      transition: all 1s;
    }

    &-contain.slide-leave-to {
      right: -385px;
    }
  }

</style>
