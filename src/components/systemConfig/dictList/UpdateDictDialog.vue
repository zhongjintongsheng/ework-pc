<template>
  <el-dialog title="修改字典" :visible.sync="dialog.visible" @closed="requestComplete" width="600px">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="rule-form" v-loading="dialog.loading">
      <el-form-item label="字典类型：" prop="dictType">
        <el-input v-model="form.dictType" placeholder="请输入字典类型" clearable class="input"></el-input>
      </el-form-item>
      <el-form-item label="字典名称：" prop="dictName">
        <el-input v-model="form.dictName" placeholder="请输入字典名称" clearable class="input"></el-input>
      </el-form-item>
      <el-form-item label="数据项关键字：" prop="optionKey">
        <el-input v-model="form.optionKey" placeholder="请输入数据项关键字" clearable class="input"></el-input>
      </el-form-item>
      <el-form-item label="数据项名称：" prop="optionName">
        <el-input v-model="form.optionName" placeholder="请输入数据项名称" clearable class="input"></el-input>
      </el-form-item>
      <el-form-item label="数据项编码：" prop="optionCode">
        <el-input v-model="form.optionCode" placeholder="请输入数据项编码" clearable class="input"></el-input>
      </el-form-item>
      <el-form-item label="数据项排序：" prop="showOrder">
        <el-input-number v-model="form.showOrder" :min="0" :max="100"></el-input-number>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button type="primary" :loading="dialog.loading" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: {
        visible: false,
        loading: false
      },
      form: {
        dictType: '',
        dictName: '',
        optionKey: '',
        optionName: '',
        optionCode: '',
        showOrder: 0
      },
      rules: {
        dictType: { required: true, message: '请输入字典类型', trigger: 'blur' },
        dictName: { required: true, message: '请输入字典名称', trigger: 'blur' },
        optionKey: { required: true, message: '请输入数据项关键字', trigger: 'blur' },
        optionName: { required: true, message: '请输入数据项名称', trigger: 'blur' }
      }
    }
  },
  methods: {
    show (row) {
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.form = Object.assign({}, row)
      })
    },
    confirm () {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.dialog.loading = true
        this.$http.post({
          url: this.$apis.dictList.updateDict,
          param: this.form,
          loading: false,
          success: () => {
            this.$util.notify('修改成功')
            this.dialog.visible = false
            this.$emit('close')
          },
          complete: () => {
            this.requestComplete()
          }
        })
      })
    },
    requestComplete () {
      setTimeout(() => {
        this.dialog.loading = false
      }, this.$config.LOADING_DELAYED)
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 400px;
}
</style>
