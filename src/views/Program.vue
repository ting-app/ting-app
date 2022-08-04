<template>
  <div class="container">
    <Navigation></Navigation>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'Program',
  components: {
    Navigation
  },
  data () {
    return {
    }
  },
  created () {
    const id = this.$route.params.id

    console.log(id)
  }
}
</script>
