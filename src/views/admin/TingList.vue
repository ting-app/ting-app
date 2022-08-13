<template>
  <div class="container">
    <Navigation></Navigation>
    <Overlay :loading="loading"></Overlay>
    <TingList></TingList>
    <v-row justify="center" v-if="!loading">
      <v-col cols="9" class="ma-12">
        <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import TingList from '@/components/TingList.vue'
import axios from '@/axios'

export default {
  name: 'TingListAdmin',
  components: {
    Overlay,
    Navigation,
    TingList
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
          text: '我的节目',
          disabled: false,
          href: '/#/admin/programs'
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
      program: null
    }
  },
  created () {
    const programId = this.$route.params.programId

    this.loading = true

    axios.get(`/programs/${programId}`)
      .then((response) => {
        this.program = response
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
