<template>
  <div class="container">
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <Navigation></Navigation>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import axios from '@/axios'

export default {
  name: 'Program',
  components: {
    Navigation
  },
  data () {
    return {
      loading: false,
      program: null,
      tings: []
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
