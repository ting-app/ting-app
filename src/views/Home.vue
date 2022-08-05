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
