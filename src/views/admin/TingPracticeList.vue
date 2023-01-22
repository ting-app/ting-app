<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <div class="container my-10">
      <v-row justify="center">
        <v-col cols="8">
          <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
        </v-col>
      </v-row>
      <div v-if="loaded">
        <div v-if="tingPractices.length === 0">
          <v-row justify="center">
            <v-col cols="8">
              <p class="text-body-1 text-center">暂无听写</p>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <v-row v-for="tingPractice in tingPractices" :key="tingPractice.id" justify="center">
            <v-col cols="8">
              <p>
                <router-link :to="`/tings/${tingPractice.tingId}`" class="text-h6">{{ tingPractice.tingTitle }}</router-link>
              </p>
              <span class="text-caption mr-4">听写时间：{{ formatDateTime(tingPractice.createdAt) }}</span>
              <span class="text-caption mr-4">正确率：{{ (tingPractice.score * 100).toFixed(2) }}%</span>
              <span class="text-caption mr-4">用时：{{ formatDuration(tingPractice.timeCostInSeconds) }}</span>
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row v-intersect="onIntersect"></v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
import Overlay from '@/components/Overlay.vue'
import axios from '@/axios'
import UnauthorizedError from '@/error/unauthorized-error'
import { formatDateTime } from '@/util'
import dayjs from '@/dayjs'
import Constant from '@/constant'

export default {
  name: 'TingPracticeList',
  components: {
    Overlay,
    Navigation
  },
  computed: {
    me () {
      return this.$store.state.me
    },
    breadcrumbs () {
      const breadcrumbs = [
        {
          text: '首页',
          disabled: false,
          href: '/#/'
        },
        {
          text: '我的听写',
          disabled: true
        }
      ]

      return breadcrumbs
    }
  },
  data () {
    return {
      loaded: false,
      loading: false,
      tingPractices: [],
      page: 1,
      pageSize: Constant.defaultPageSize
    }
  },
  methods: {
    formatDateTime (dateTime) {
      return formatDateTime(dateTime)
    },
    formatDuration (seconds) {
      return dayjs.duration(seconds, 'seconds')
        .format('HH:mm:ss')
    },
    getTingPractices (page) {
      this.page = page
      this.loading = true

      axios.get(`/tingPractices?createdBy=${this.me.id}&page=${this.page}&pageSize=${this.pageSize}`)
        .then((response) => {
          this.loaded = true

          response.forEach((tingPractice) => {
            this.tingPractices.push(tingPractice)
          })
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
    },
    onIntersect (entries, observer, intersecting) {
      const page = this.page + 1

      this.getTingPractices(page)
    }
  },
  created () {
    const page = 1

    this.getTingPractices(page)
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
