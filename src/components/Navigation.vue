<template>
  <div class="container">
    <v-app-bar
      absolute
      color="white"
    >
      <v-spacer></v-spacer>
      <div v-if="me">
        <span>{{ me.name }}</span>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              plain
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item class="pointer"
            >
              <v-list-item-title @click="signOut">退出</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn text @click="login">
          登陆
        </v-btn>
        <v-btn text @click="register">
          注册
        </v-btn>
      </div>
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
    },
    login () {
      this.$router.push('/login')
    },
    signOut () {
      axios.post('/users/signOut')
        .then((response) => {
          this.$store.commit('setMe', null)
        })
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

<style>
.pointer {
  cursor: pointer;
}
</style>
