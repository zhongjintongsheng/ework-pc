export default {
  data () {
    return {
      // 页面激活时是否查询数据
      needQuery: true,
      queryUrl: '',
      queryForm: {},
      tableData: {
        content: [],
        totalElements: 0
      },
      currentPage: 1
    }
  },
  activated () {
    let closedIndex = this._.findIndex(this.$store.state.closedTabs, ['routeGroup', this.$route.meta.group])
    // 如果页面被打开，又被关闭，则重置数据
    if (closedIndex > -1) {
      this.initData()
      this.$store.commit('removeClosedTab', closedIndex)
    }
    this.preActivated()
    if (this.needQuery) {
      this.query()
    }
  },
  methods: {
    initData () {
      this.preInitData()
      if (this.$refs.baseQuery) {
        this.$refs.baseQuery.initForm()
      }
      this.tableData = {
        content: [],
        totalElements: 0
      }
      this.currentPage = 1
    },
    query (pageNo = this.currentPage) {
      if (!this.preQuery()) {
        return
      }
      this.currentPage = pageNo
      this.$http.get({
        url: this.queryUrl,
        param: this.$util.handleQueryParam(this.queryForm, pageNo),
        success: ({ data }) => {
          if (!this.postQuery(data)) {
            return
          }
          this.tableData = data
        }
      })
    },
    // initData 函数里优先执行(如重置统计信息的数据)
    preInitData () {},
    // activated 钩子里优先执行(如初始化从url获取的查询条件)
    preActivated () {},
    // 发起查询请求前(如增加除查询表单以外的其它查询条件、判断查询条件是否必填)
    preQuery () {
      return true
    },
    // 查询成功后
    postQuery () {
      return true
    },
    currentChange (val) {
      if (this.currentPage === val) {
        return
      }
      this.currentPage = val
      this.query()
    }
  }
}
