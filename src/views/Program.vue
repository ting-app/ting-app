<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <div class="container my-10">
      <v-row justify="center">
        <v-col cols="6">
          <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <div v-if="loaded">
        <div v-if="tings.length === 0">
          <v-row justify="center">
            <p class="text-body-1">暂无听力</p>
          </v-row>
        </div>
        <div v-else>
          <v-row v-for="ting in tings" :key="ting.id" justify="center">
            <v-col cols="6">
              <p>
                <router-link :to="`/tings/${ting.id}`" class="text-h6">{{ ting.title }}</router-link>
              </p>
              <p class="text-body-1">{{ ting.description }}</p>
              <p class="text-caption">创建时间：{{ formatDateTime(ting.createdAt) }}</p>
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
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import axios from '@/axios'
import { formatDateTime } from '@/util'

export default {
  name: 'Program',
  components: {
    Overlay,
    Navigation
  },
  computed: {
    breadcrumbs () {
      const breadcrumbs = []

      if (this.program) {
        breadcrumbs.push({
          text: '首页',
          disabled: false,
          href: '/#/'
        })

        breadcrumbs.push({
          text: this.program.title,
          disabled: true
        })
      }

      return breadcrumbs
    }
  },
  data () {
    return {
      loading: false,
      loaded: false,
      program: null,
      tings: [],
      page: 1,
      pageSize: 5
    }
  },
  methods: {
    formatDateTime (dateTime) {
      return formatDateTime(dateTime)
    },
    getTings (programId, page) {
      this.loading = true
      this.page = page

      const url = `/tings?programId=${programId}&page=${page}&pageSize=${this.pageSize}`

      return axios.get(url)
        .then((response) => {
          this.loaded = true

          response.forEach((ting) => {
            this.tings.push(ting)
          })
        })
        .catch((error) => {
          console.error(error)

          this.$toast.error(error.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onIntersect (entries, observer, intersecting) {
      this.getTings(this.program.id, this.page + 1)
    }
  },
  created () {
    const id = this.$route.params.id

    this.loading = true

    axios.get(`/programs/${id}`)
      .then((response) => {
        this.program = response
      })
      .then(() => {
        const page = 1

        return this.getTings(this.program.id, page)
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
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
