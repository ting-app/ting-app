<template>
  <div class="container">
    <v-row justify="center">
      <v-col cols="2">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="name"
            :counter="20"
            :rules="nameRules"
            label="姓名"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="密码"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmedPassword"
            :rules="confirmedPasswordRules"
            label="确认密码"
            type="password"
            required
          ></v-text-field>
          <div class="text-align-center">
            <v-btn
              :disabled="!valid"
              class="mr-4"
              @click="validate"
            >
              注册
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      name: '',
      password: '',
      confirmedPassword: '',
      valid: false,
      nameRules: [
        v => !!v || '姓名不能为空',
        v => v.length <= 20 || '姓名不能超过20个字符'
      ],
      passwordRules: [
        v => !!v || '密码不能为空',
        v => v.length >= 6 || '密码不能少于6个字符',
        v => v.length <= 20 || '密码不能超过20个字符'
      ],
      confirmedPasswordRules: [
        v => !!v || '确认密码不能为空',
        v => v === this.password || '两次密码不一致'
      ]
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    }
  }
}
</script>

<style>
.text-align-center {
  text-align: center;
}
</style>
