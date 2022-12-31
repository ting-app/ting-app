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
      <div v-if="loaded">
        <div v-if="programs.length === 0">
          <v-row justify="center">
            <v-col cols="6">
              <p class="text-body-1 text-center">暂无节目</p>
            </v-col>
          </v-row>
        </div>
        <div v-else>
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
          <v-row v-intersect="onIntersect"></v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import axios from '@/axios'
import { formatDateTime } from '@/util'
import Languages from '@/languages'
import Constant from '@/constant'

export default {
  name: 'Home',
  components: {
    Overlay,
    Navigation
  },
  data () {
    return {
      loading: false,
      loaded: false,
      programs: [],
      languages: [{
        text: '全部',
        value: 0
      }].concat(Languages),
      selectedLanguage: 0,
      page: 1,
      pageSize: Constant.defaultPageSize
    }
  },
  methods: {
    formatDateTime (dateTime) {
      return formatDateTime(dateTime)
    },
    getPrograms (page, language) {
      const languageChanged = language !== this.selectedLanguage

      this.loading = true
      this.page = page
      this.selectedLanguage = language

      let url = '/programs'
      const pageQuery = `page=${this.page}&pageSize=${this.pageSize}`

      if (language > 0) {
        url += `?language=${language}&${pageQuery}`
      } else {
        url += `?${pageQuery}`
      }

      axios.get(url)
        .then((response) => {
          this.loaded = true

          if (languageChanged) {
            this.programs = response
          } else {
            response.forEach((program) => {
              this.programs.push(program)
            })
          }
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
      const page = 1

      this.getPrograms(page, language)
    },
    onIntersect (entries, observer, intersecting) {
      const page = this.page + 1

      this.getPrograms(page, this.selectedLanguage)
    }
  },
  created () {
    const page = 1
    const language = 0

    this.getPrograms(page, language)
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
