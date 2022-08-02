<template>
  <div class="container">
    <v-row justify="center">
      <v-col cols="3">
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
            v-model="password"
            :rules="passwordRules"
            label="密码*"
            type="password"
            required
          ></v-text-field>
          <div class="text-center">
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

export default {
  name: 'Register',
  data () {
    return {
      valid: true,
      loading: false,
      name: '',
      password: '',
      nameRules: [
        v => !!v || '姓名不能为空',
        v => v.length <= 20 || '姓名不能超过20个字符'
      ],
      passwordRules: [
        v => !!v || '密码不能为空',
        v => v.length >= 6 || '密码不能少于6个字符',
        v => v.length <= 20 || '密码不能超过20个字符'
      ]
    }
  },
  methods: {
    login () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      const user = {
        name: this.name,
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
