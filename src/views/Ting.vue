<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <div class="container ma-10">
      <v-row justify="center" v-if="ting">
        <v-col cols="6">
          <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
          <hr>
          <div class="container">
            <p class="text-h6">描述：</p>
            <p class="text-body-1">{{ ting.description }}</p>
          </div>
          <hr>
          <div class="container">
            <div class="container text-center">
              <Player theme="light">
                <Audio>
                  <source
                    :data-src="ting.audioUrl"
                  />
                </Audio>
                <DefaultUi />
              </Player>
            </div>
            <v-tabs fixed-tabs v-model="tab">
              <v-tab key="ting">听写</v-tab>
              <v-tab key="content">原文</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="ma-5">
              <v-tab-item key="ting">
                <div class="container text-center">
                  <template v-if="start">
                    <v-form>
                      <v-textarea
                        clearable
                        clear-icon="mdi-close-circle"
                        label="你的听写"
                        v-model="tingContent"
                      ></v-textarea>
                    </v-form>
                    <div class="container">
                      <v-btn class="ma-2" @click="check">提交</v-btn>
                      <v-btn class="ma-2" @click="cancel">取消</v-btn>
                    </div>
                  </template>
                  <template v-else>
                    <v-btn @click="start = true">开始听写</v-btn>
                  </template>
                </div>
              </v-tab-item>
              <v-tab-item key="content">
                <div class="container">
                  <p class="text-body-1">{{ ting.content }}</p>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import { Player, Audio, DefaultUi } from '@vime/vue'
import axios from '@/axios'
import { getLanguageByValue } from '@/languages'
import * as Diff from 'diff'

export default {
  name: 'Ting',
  components: {
    Overlay,
    Navigation,
    Player,
    Audio,
    DefaultUi
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
          disabled: true
        })
      }

      return breadcrumbs
    }
  },
  methods: {
    check () {
      const diff = Diff.diffChars(this.ting.content, this.tingContent)

      console.log(diff)
    },
    cancel () {
      this.start = false
      this.tingContent = ''
    }
  },
  data () {
    return {
      loading: false,
      ting: null,
      program: null,
      tab: null,
      start: false,
      tingContent: ''
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
