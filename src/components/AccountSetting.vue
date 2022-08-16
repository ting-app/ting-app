<template>
  <div class="container">
    <p class="text-h5">修改密码</p>
    <v-divider></v-divider>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="oldPassword"
        :rules="oldPasswordRules"
        label="旧密码*"
        type="password"
        required
      ></v-text-field>
      <v-text-field
        v-model="newPassword"
        :rules="passwordRules"
        label="新密码*"
        type="password"
        required
      ></v-text-field>
      <v-text-field
        v-model="confirmNewPassword"
        :rules="passwordRules"
        label="确认新密码*"
        type="password"
        required
      ></v-text-field>
      <div class="text-center">
        <v-btn
          :disabled="!valid || loading"
          :loading="loading"
          class="mr-4"
          @click="changePassword"
        >
          提交
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from '@/axios'
import UnauthorizedError from '@/error/unauthorized-error'

export default {
  name: 'AccountSetting',
  data () {
    return {
      valid: true,
      loading: false,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      oldPasswordRules: [
        v => !!v || '密码不能为空'
      ],
      passwordRules: [
        v => !!v || '密码不能为空',
        v => v.length >= 6 || '密码不能少于6个字符',
        v => v.length <= 20 || '密码不能超过20个字符'
      ]
    }
  },
  methods: {
    changePassword () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      axios.post('/users/me/changePassword', {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        confirmNewPassword: this.confirmNewPassword
      })
        .then((_) => {
          this.$toast.info('密码修改成功')
        })
        .catch((error) => {
          console.error(error)

          if (error instanceof UnauthorizedError) {
            this.$router.push('/login')
          } else {
            this.$toast.error(error.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
