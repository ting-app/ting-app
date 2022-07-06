<template>
  <div class="container">
    <v-app-bar
      absolute
      color="white"
    >
      <v-spacer></v-spacer>
      <template v-if="me">
        <span>{{ me.name }}</span>
      </template>
      <template v-else>
        <v-btn text>
          登陆
        </v-btn>
        <v-btn text @click="register">
          注册
        </v-btn>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Navigation',
  computed: {
    me () {
      return this.$store.state.me
    }
  },
  data () {
    return {
    }
  },
  methods: {
    register () {
      this.$router.push('/register')
    }
  },
  created () {
    axios.get('/users/me')
      .then((response) => {
        this.$store.commit('setMe', response.data)
      })
  }
}
</script>
