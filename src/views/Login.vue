<template>
  <div class="container">
    <v-row justify="center">
      <v-col cols="4">
        <p class="text-h5 text-center">登陆</p>
        <v-divider></v-divider>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="nameOrEmail"
            :rules="nameOrEmailRules"
            label="姓名或邮箱地址*"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="密码*"
            type="password"
            required
          ></v-text-field>
          <div v-if="unverified">
            <p>
              未收到验证邮件？
              <v-btn
                :disabled="!valid || loading"
                :loading="loading"
                @click="verifyEmail"
              >重新发送
              </v-btn>
            </p>
            <v-divider></v-divider>
          </div>
          <div class="container text-center">
            <v-btn
              :disabled="!valid || loading"
              :loading="loading"
              class="mr-4"
              @click="login"
            >
              登陆
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
    </v-row>
  </div>
</template>

<script>
import axios from '@/axios'
import UnverifiedError from '@/error/unverified-error'

export default {
  name: 'Login',
  data () {
    return {
      valid: true,
      loading: false,
      nameOrEmail: '',
      password: '',
      nameOrEmailRules: [
        v => !!v || '姓名或邮箱地址不能为空'
      ],
      passwordRules: [
        v => !!v || '密码不能为空'
      ],
      unverified: false
    }
  },
  methods: {
    login () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      const user = {
        nameOrEmail: this.nameOrEmail,
        password: this.password
      }

      axios.post('/auth/login', user)
        .then((response) => {
          localStorage.setItem('me', JSON.stringify(response))
          this.$store.commit('setMe', response)
          this.$router.push('/')
        })
        .catch((error) => {
          console.error(error)

          this.$toast.error(error.message)

          if (error instanceof UnverifiedError) {
            this.unverified = true
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    goBack () {
      this.$router.push('/')
    },
    verifyEmail () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      axios.post('/users/verifyEmail', {
        nameOrEmail: this.nameOrEmail,
        password: this.password
      })
        .then((_) => {
          this.$toast.info('确认邮件已发送到注册时所填写的邮箱，请注意查收')
        })
        .catch((error) => {
          console.error(error)

          this.$toast.error(error.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
