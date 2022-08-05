<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <div class="container ma-10">
      <v-row v-for="program in programs" :key="program.id" justify="center">
        <v-col cols="6">
          <p>
            <router-link :to="`/programs/${program.id}`" class="text-h6">{{ program.title }}</router-link>
          </p>
          <p class="text-body-1">{{ program.description }}</p>
          <p class="text-caption">创建时间：{{ format(program.createdAt) }}</p>
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
  name: 'Home',
  components: {
    Overlay,
    Navigation
  },
  data () {
    return {
      loading: false,
      programs: []
    }
  },
  methods: {
    format (dateTime) {
      return formatDateTime(dateTime)
    }
  },
  created () {
    this.loading = true

    axios.get('/programs')
      .then((response) => {
        this.programs = response
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
