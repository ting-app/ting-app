<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
  </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue'
import axios from 'axios'

export default {
  name: 'RegisterConfirm',
  components: {
    Overlay
  },
  data () {
    return {
      loading: false
    }
  },
  created () {
    const key = this.$route.query.key

    this.loading = true

    axios.post(`/users/confirmRegistration?key=${key}`)
      .then((_) => {
        this.$toast.info('注册已确认，正在跳转登陆')

        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
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
