<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <div class="container my-10">
      <v-row justify="center">
        <v-col cols="6">
          <v-chip
            v-for="language in languages"
            :key="language.value"
            class="ma-2 pointer"
            :color="language.value === selectedLanguage ? 'primary': 'default'"
            @click="selectLanguage(language.value)"
          >
            {{ language.text }}
          </v-chip>
        </v-col>
      </v-row>
      <template v-if="programs.length === 0">
        <v-row justify="center">
          <v-col cols="6">
            <p class="text-body-1 text-center">暂无节目</p>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row v-for="program in programs" :key="program.id" justify="center">
          <v-col cols="6">
            <p>
              <router-link :to="`/programs/${program.id}`" class="text-h6">{{ program.title }}</router-link>
            </p>
            <p class="text-body-1">{{ program.description }}</p>
            <p class="text-caption">创建时间：{{ formatDateTime(program.createdAt) }}</p>
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </template>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import axios from '@/axios'
import { formatDateTime } from '@/util'
import Languages from '@/languages'

export default {
  name: 'Home',
  components: {
    Overlay,
    Navigation
  },
  data () {
    return {
      loading: false,
      programs: [],
      languages: [{
        text: '全部',
        value: 0
      }].concat(Languages),
      selectedLanguage: 0
    }
  },
  methods: {
    formatDateTime (dateTime) {
      return formatDateTime(dateTime)
    },
    getPrograms () {
      this.loading = true

      let url = '/programs'
      const language = this.selectedLanguage

      if (language) {
        url += `?language=${language}`
      }

      axios.get(url)
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
    },
    selectLanguage (language) {
      this.selectedLanguage = language
      this.getPrograms()
    }
  },
  created () {
    this.getPrograms()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}

.pointer {
  cursor: pointer;
}
</style>
