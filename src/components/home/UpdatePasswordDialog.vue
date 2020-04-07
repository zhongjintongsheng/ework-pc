<template>
  <el-dialog title="修改密码" :visible.sync="dialog.visible" @closed="requestComplete" width="600px">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="rule-form">
      <el-form-item label="当前密码：" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" placeholder="请输入当前密码" clearable class="input"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" clearable class="input"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请输入确认密码" clearable class="input"></el-input>
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
    const paswwordPattern = /(?=.*[0-9])(?=.*[A-Za-z])(?=.*[~`!@#$%^&*()=+_-])^[0-9A-Za-z~`!@#$%^&*()=+_-]{8,16}$/
    return {
      dialog: {
        visible: false,
        loading: false
      },
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: { required: true, message: '请输入当前密码', trigger: 'blur' },
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: paswwordPattern, message: '密码长度8到16位，包含数字、字母和字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { pattern: paswwordPattern, message: '密码长度8到16位，包含数字、字母和字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show () {
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    confirm () {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        if (this.form.newPassword === this.form.oldPassword) {
          this.$util.notify('新密码和当前密码不能相同', 'error')
          return
        }
        if (this.form.newPassword !== this.form.confirmPassword) {
          this.$util.notify('确认密码和新密码不一致', 'error')
          return
        }
        this.dialog.loading = true
        let user = this.$util.getStorage('user')
        let currentPassword = this.$util.sha256(user.loginName + this.$util.sha256(this.form.oldPassword))
        let targetPassword = this.$util.rsa(this.form.newPassword)
        let param = {
          currentPassword,
          targetPassword
        }
        this.$http.post({
          url: this.$apis.base.modifyPwd,
          param,
          success: () => {
            this.dialog.visible = false
            this.$util.notify('密码修改成功，请重新登录')
            setTimeout(() => {
              this.$util.go2Login()
            }, 1500)
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
