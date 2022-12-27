<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <div class="container my-10">
      <v-row justify="center" v-if="program && ting">
        <v-col cols="6">
          <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
          <v-divider></v-divider>
          <div class="container">
            <p class="text-h6">描述：</p>
            <p class="text-body-1">{{ ting.description }}</p>
          </div>
          <v-divider></v-divider>
          <div class="container">
            <div class="container text-center">
              <div id="player"></div>
            </div>
            <v-tabs fixed-tabs v-model="tab">
              <v-tab key="ting">听写</v-tab>
              <v-tab key="content">原文</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="my-5">
              <v-tab-item key="ting">
                <div class="container">
                  <template v-if="started">
                    <p class="text-right">{{ duration }}</p>
                    <v-form>
                      <v-textarea
                        clearable
                        clear-icon="mdi-close-circle"
                        label="你的听写"
                        v-model="tingPractice.content"
                      ></v-textarea>
                    </v-form>
                    <div class="container text-center">
                      <v-btn class="ma-2" @click="check">提交</v-btn>
                      <v-btn class="ma-2" @click="cancel">取消</v-btn>
                    </div>
                  </template>
                  <template v-else-if="finished">
                    <div class="diff">
                      <p class="text-body-1">
                        <span v-for="(diff, index) in diffs" :key="index">
                          <span v-if="!diff.added && !diff.removed">{{ diff.value }}</span>
                          <span v-else-if="diff.added" class="diff-added">{{ diff.value }}</span>
                          <span v-else-if="diff.removed" class="diff-removed">{{ diff.value }}</span>
                        </span>
                      </p>
                    </div>
                    <div class="my-10">
                      <v-row>
                        <v-col cols="6">用时：{{ duration }}</v-col>
                        <v-col cols="6">正确率：{{ (tingPractice.score * 100).toFixed(2) }}%</v-col>
                      </v-row>
                    </div>
                    <div class="container text-center">
                      <v-btn @click="practice">再次听写</v-btn>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-center">
                      <v-btn @click="practice">开始听写</v-btn>
                    </div>
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
/* global Playerjs */
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import axios from '@/axios'
import * as Diff from 'diff'
import dayjs from '@/dayjs'
import UnauthorizedError from '@/error/unauthorized-error'

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
        breadcrumbs.push({
          text: '首页',
          disabled: false,
          href: '/#/'
        })

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
    },
    duration () {
      return dayjs.duration(this.tingPractice.timeCostInSeconds, 'seconds')
        .format('HH:mm:ss')
    },
    diffs () {
      return Diff.diffChars(this.ting.content, this.tingPractice.content)
    }
  },
  data () {
    return {
      loading: false,
      ting: null,
      program: null,
      tab: null,
      started: false,
      finished: false,
      ticker: null,
      tingPractice: {
        tingId: 0,
        content: '',
        score: 0,
        timeCostInSeconds: 0
      },
      player: null
    }
  },
  methods: {
    practice () {
      this.started = true
      this.finished = false
      this.tingPractice.content = ''
      this.tingPractice.timeCostInSeconds = 0

      this.ticker = setInterval(() => {
        this.tingPractice.timeCostInSeconds += 1
      }, 1000)
    },
    check () {
      this.started = false
      this.finished = true

      clearInterval(this.ticker)

      const diffs = Diff.diffChars(this.ting.content, this.tingPractice.content)
      const diffCount = diffs.map(diff => {
        if (!diff.added && !diff.removed) {
          return 0
        }

        return diff.value.length
      }).reduce((a, b) => {
        return a + b
      }, 0)
      const score = 1 - diffCount / this.ting.content.length

      this.tingPractice.score = Math.max(0, score)

      if (this.$store.state.me) {
        this.loading = true

        axios.post('/tingPractices', this.tingPractice)
          .catch((error) => {
            if (error instanceof UnauthorizedError) {
              this.$router.push('/login')
            } else {
              this.$toast.error(error.message)
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    cancel () {
      this.started = false
      this.finished = false
      this.tingPractice.content = ''
      this.tingPractice.timeCostInSeconds = 0

      clearInterval(this.ticker)
    }
  },
  mounted () {
    const id = this.$route.params.id

    this.loading = false

    axios.get(`/tings/${id}`)
      .then((response) => {
        this.ting = response
        this.tingPractice.tingId = response.id

        return axios.get(`/programs/${response.programId}`)
      })
      .then((response) => {
        this.program = response
      })
      .then(() => {
        this.player = new Playerjs({
          id: 'player',
          file: this.ting.audioUrl
        })
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

<style>
.diff-added {
  color: green;
}

.diff-removed {
  color: red;
  text-decoration: line-through;
}
</style>
