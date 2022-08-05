<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <div class="container ma-10">
      <v-row justify="center">
        <v-col cols="6">
          <v-card v-if="program">
            <v-card-text>
              <p class="text-h4 text--primary">
                {{ program.title }}
              </p>
              <div class="text--primary">
                {{ program.description }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-for="ting in tings" :key="ting.id" justify="center">
        <v-col cols="6">
          <p>
            <router-link :to="`/tings/${ting.id}`" class="text-h6">{{ ting.title }}</router-link>
          </p>
          <p class="text-body-1">{{ ting.description }}</p>
          <p class="text-caption">创建时间：{{ format(ting.createdAt) }}</p>
          <hr>
        </v-col>
      </v-row>
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
  data () {
    return {
      loading: false,
      program: null,
      tings: []
    }
  },
  methods: {
    format (dateTime) {
      return formatDateTime(dateTime)
    }
  },
  created () {
    const id = this.$route.params.id

    this.loading = true

    axios.get(`/programs/${id}`)
      .then((response) => {
        this.program = response

        return axios.get(`/programs/${id}/tings`)
      })
      .then((response) => {
        this.tings = response
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
