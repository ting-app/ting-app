<template>
  <div class="container">
    <v-app-bar
      absolute
      color="white"
    >
      <v-col cols="1"></v-col>
      <v-col cols="1">
        <v-toolbar-title>Ting</v-toolbar-title>
      </v-col>
      <v-menu offset-y v-if="me">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            创建
            <v-icon
              right
              dark
            >
              mdi-plus
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="pointer" @click="createProgram">
            <v-list-item-title>节目</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
            <v-list-item class="pointer" @click="signOut"
            >
              <v-list-item-title>退出</v-list-item-title>
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
      <v-col cols="1"></v-col>
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
          this.$router.push('/')
        })
    },
    createProgram () {
      this.$router.push('/program')
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
