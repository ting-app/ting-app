<template>
  <div class="container">
    <Navigation></Navigation>
    <v-row justify="center">
      <v-col cols="9">
        <v-stepper v-model="step" class="step-container">
          <v-stepper-header>
            <v-stepper-step
              :complete="step > 1"
              step="1"
            >
              创建节目
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="step > 2"
              step="2"
            >
              创建听力
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-row justify="center" class="program-container">
                <v-col cols="8">
                  <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                    <v-text-field
                      v-model="title"
                      :counter="100"
                      :rules="titleRules"
                      label="标题*"
                      required
                    ></v-text-field>
                    <v-select
                      :items="languages"
                      label="语言*"
                      v-model="language"
                    ></v-select>
                    <v-textarea
                      clearable
                      clear-icon="mdi-close-circle"
                      label="描述*"
                      v-model="description"
                      :counter="200"
                      :rules="descriptionRules"
                    ></v-textarea>
                    <v-radio-group v-model="visible" row>
                      <v-radio :value="true" label="公开"></v-radio>
                      <v-radio :value="false" label="私有"></v-radio>
                    </v-radio-group>
                    <div class="text-center">
                      <v-btn
                        :disabled="!valid || loading"
                        :loading="loading"
                        class="mr-4"
                        @click="createProgram"
                      >
                        创建
                      </v-btn>
                      <v-btn
                        :disabled="loading"
                        class="mr-4"
                        @click="goBack"
                      >
                        返回
                      </v-btn>
                    </div>
                  </v-form>
                </v-col>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-row justify="center" class="program-container">
                <v-col cols="4">
                  <div class="text-center">
                    <v-btn class="ma-2" @click="createTing">
                      添加听力
                      <v-icon
                        right
                        dark
                      >
                        mdi-plus
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-2" @click="complete">完成</v-btn>
                  </div>
                </v-col>
              </v-row>
              <div class="mb-5">
                <TingList></TingList>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
    <CreateTing></CreateTing>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import CreateTing from '@/components/CreateTing.vue'
import TingList from '@/components/TingList.vue'
import axios from '@/axios'
import UnauthorizedError from '@/error/unauthorized-error'
import eventBus from '@/event-bus'
import Languages from '@/languages'
import EventTypes from '@/event-types'

export default {
  name: 'CreateProgram',
  components: {
    Navigation,
    CreateTing,
    TingList
  },
  data () {
    return {
      programId: 0,
      step: 1,
      valid: true,
      loading: false,
      title: '',
      titleRules: [
        v => !!v || '标题不能为空',
        v => v.length <= 100 || '标题不能超过100个字符'
      ],
      description: '',
      descriptionRules: [
        v => !!v || '描述不能为空',
        v => v.length <= 200 || '描述不能超过200个字符'
      ],
      language: 1,
      languages: Languages,
      visible: true
    }
  },
  methods: {
    createProgram () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      const program = {
        title: this.title,
        language: this.language,
        description: this.description,
        visible: this.visible
      }

      axios.post('/programs', program)
        .then((response) => {
          this.step = 2
          this.programId = response.id

          eventBus.$emit(EventTypes.PROGRAM_CREATED, this.programId)
        })
        .catch((error) => {
          console.error(error)

          if (error instanceof UnauthorizedError) {
            this.$router.push('/login')
          } else {
            this.$toast.error(error.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    goBack () {
      this.$router.push('/')
    },
    createTing () {
      eventBus.$emit(EventTypes.CREATE_TING, this.programId)
    },
    complete () {
      this.$router.push(`/programs/${this.programId}`)
    }
  }
}
</script>

<style scoped>
.step-container {
  margin-top: 64px;
}

.program-container {
  margin-bottom: 24px;
}
</style>
