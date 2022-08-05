<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import axios from '@/axios'

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
