<template>
  <div class="container">
    <v-app-bar
      absolute
      color="white"
    >
      <v-spacer></v-spacer>
      <v-btn text>
        登陆
      </v-btn>
      <v-btn text @click="register">
        注册
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {}
  },
  methods: {
    register () {
      this.$router.push('/register')
    }
  }
}
</script>
