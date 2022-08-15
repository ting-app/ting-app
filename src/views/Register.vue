<template>
  <div class="container">
    <v-row justify="center">
      <v-col cols="3" v-if="!finished">
        <p class="text-h5 text-center">注册</p>
        <v-divider></v-divider>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="name"
            :counter="20"
            :rules="nameRules"
            label="姓名*"
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="邮箱*"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="密码*"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            :rules="confirmPasswordRules"
            label="确认密码*"
            type="password"
            required
          ></v-text-field>
          <div class="text-center">
            <v-btn
              :disabled="!valid || loading"
              :loading="loading"
              class="mr-4"
              @click="register"
            >
              注册
            </v-btn>
            <v-btn
              :disabled="loading"
              class="mr-4"
              @click="goBack"
            >
              返回
            </v-btn>
          </div>
        </v-form>
      </v-col>
      <v-col cols="3" v-else>
        <p class="text-h5 text-center">注册确认</p>
        <v-divider></v-divider>
        <p class="text-body-1 text-center my-10">已发送注册确认邮件到您的邮箱中，请注意查收。</p>
        <div class="text-center">
          <v-btn
            class="mr-4"
            @click="$router.push('/login')"
          >
            登陆
          </v-btn>
          <v-btn
            class="mr-4"
            @click="goBack"
          >
            返回
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'Register',
  data () {
    return {
      valid: true,
      loading: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      nameRules: [
        v => !!v || '姓名不能为空',
        v => v.length <= 20 || '姓名不能超过20个字符'
      ],
      emailRules: [
        v => !!v || '邮箱地址不能为空',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '邮箱地址不合法'
      ],
      passwordRules: [
        v => !!v || '密码不能为空',
        v => v.length >= 6 || '密码不能少于6个字符',
        v => v.length <= 20 || '密码不能超过20个字符'
      ],
      confirmPasswordRules: [
        v => !!v || '确认密码不能为空',
        v => v === this.password || '两次密码不一致'
      ],
      finished: false
    }
  },
  methods: {
    register () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      const user = {
        name: this.name,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      }

      axios.post('/users', user)
        .then((response) => {
          this.finished = true
        })
        .catch((error) => {
          console.error(error)

          this.$toast.error(error.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>
