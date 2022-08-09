<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'

export default {
  name: 'ProgramList',
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

  }
}
</script>
