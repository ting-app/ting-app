<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <div class="container ma-10">
      <v-row justify="center">
        <v-col cols="6">
          <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import axios from '@/axios'
import { getLanguageByValue } from '@/languages'

export default {
  name: 'Ting',
  components: {
    Overlay,
    Navigation
  },
  computed: {
    breadcrumbs () {
      const breadcrumbs = []

      if (this.program && this.ting) {
        const language = getLanguageByValue(this.program.language)

        if (language) {
          breadcrumbs.push({
            text: language.text,
            disabled: false,
            href: `/#/?language=${this.program.language}`
          })
        }

        breadcrumbs.push({
          text: this.program.title,
          disabled: false,
          href: `/#/programs/${this.program.id}`
        })

        breadcrumbs.push({
          text: this.ting.title,
          disabled: true,
          href: 'a'
        })
      }

      return breadcrumbs
    }
  },
  data () {
    return {
      loading: false,
      ting: null,
      program: null
    }
  },
  created () {
    const id = this.$route.params.id

    this.loading = false

    axios.get(`/tings/${id}`)
      .then((response) => {
        this.ting = response

        return axios.get(`/programs/${response.programId}`)
      })
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
