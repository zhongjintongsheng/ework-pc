<template>
  <base-content>
    <template v-slot:table>
      <!-- 查询表单区 -->
      <base-query v-model="queryForm" ref="baseQuery" :queryCondition="queryCondition" @query="query(1)">
        <template v-slot:operate>
          <el-button v-permission="'dict:add'" type="primary" @click="add()"><i class="el-icon-plus button-icon"></i>新增
          </el-button>
        </template>
      </base-query>
      <!-- 表格区 -->
      <base-table :data="tableData.content" :columns="columns"
        :operation="$util.checkPermission(['dict:add', 'dict:update', 'dict:delete'])">
        <template v-slot="{ row }">
          <el-dropdown>
            <el-button>操作</el-button>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-permission="'dict:add'" @click.native="add(row)">新增</el-dropdown-item>
                <el-dropdown-item v-permission="'dict:update'" @click.native="update(row)">修改</el-dropdown-item>
                <el-dropdown-item v-permission="'dict:delete'" @click.native="remove(row)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </base-table>
    </template>
    <!-- 分页区 -->
    <template v-slot:pagination>
      <el-pagination @current-change="currentChange" :current-page="currentPage" :page-size="$config.DEFAULT_PAGE_SIZE"
        layout="total, prev, pager, next, jumper" :total="tableData.totalElements">
      </el-pagination>
    </template>
    <!-- 新增字典模态框 -->
    <add-dict-dialog ref="addDictDialog" @close="query"></add-dict-dialog>
    <!-- 修改字典模态框 -->
    <update-dict-dialog ref="updateDictDialog" @close="query"></update-dict-dialog>
  </base-content>
</template>

<script>
import AddDictDialog from '@/components/systemConfig/dictList/AddDictDialog.vue'
import UpdateDictDialog from '@/components/systemConfig/dictList/UpdateDictDialog.vue'
import queryList from '@/mixins/queryList'

export default {
  components: { AddDictDialog, UpdateDictDialog },
  mixins: [queryList],
  data () {
    return {
      queryCondition: [
        { label: '字典类型', key: 'dictType', type: 'input' },
        { label: '字典名称', key: 'dictName', type: 'input' }
      ],
      columns: [
        { label: '字典类型', prop: 'dictType', width: '120' },
        { label: '字典名称', prop: 'dictName', width: '120' },
        { label: '数据项关键字', prop: 'optionKey', width: '120' },
        { label: '数据项名称', prop: 'optionName', width: '120' },
        { label: '数据项排序', prop: 'showOrder', width: '100' }
      ]
    }
  },
  created () {
    this.queryUrl = this.$apis.dictList.getDictList
  },
  methods: {
    add (row) {
      this.$refs['addDictDialog'].show(row)
    },
    update (row) {
      this.$refs['updateDictDialog'].show(row)
    },
    remove ({ id }) {
      this.$confirm('确定删除该条数据字典吗？', '提示', { type: 'warning' })
        .then(() => {
          this.$http.post({
            url: this.$apis.dictList.removeDict,
            param: { id },
            success: () => {
              this.$util.notify('删除成功')
              this.query()
            }
          })
        })
    }
  }
}
</script>
