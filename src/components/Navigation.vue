<template>
  <div class="container">
    <v-app-bar
      absolute
      color="white"
    >
      <v-col cols="2"></v-col>
      <v-toolbar-title class="navigation-tab pointer" @click="goToHome">Ting</v-toolbar-title>
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
      <v-col cols="2"></v-col>
    </v-app-bar>
  </div>
</template>

<script>
import axios from '@/axios'

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
      axios.post('/auth/signOut')
        .then((response) => {
          localStorage.removeItem('me')
          this.$store.commit('setMe', null)

          if (this.$route.name !== 'Home') {
            this.$router.push('/')
          }
        })
        .catch((error) => {
          console.error(error)

          this.$toast.error(error.message)
        })
    },
    createProgram () {
      this.$router.push('/admin/createProgram')
    },
    goToHome () {
      this.$router.push('/')
    }
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}
.navigation-tab {
  margin: 12px;
}
</style>
