<template>
  <div class="container">
    <Navigation></Navigation>
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
          创建听写
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-row justify="center" class="program-container">
            <v-col cols="4">
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-text-field
                  v-model="title"
                  :counter="100"
                  :rules="titleRules"
                  label="标题"
                  required
                ></v-text-field>
                <v-select
                :items="languages"
                  label="语言"
                  v-model="language"
                ></v-select>
                <v-textarea
                  clearable
                  clear-icon="mdi-close-circle"
                  label="描述"
                  v-model="description"
                  :counter="200"
                  :rules="descriptionRules"
                ></v-textarea>
                <div class="text-center">
                  <v-btn
                    :disabled="!valid || loading"
                    :loading="loading"
                    class="mr-4"
                    @click="create"
                  >
                    创建
                  </v-btn>
                  <v-btn
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
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import axios from '@/axios'

export default {
  name: 'ProgramAdmin',
  components: {
    Navigation
  },
  data () {
    return {
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
      languages: [
        {
          text: '英语',
          value: 1
        },
        {
          text: '日语',
          value: 2
        },
        {
          text: '韩语',
          value: 3
        },
        {
          text: '法语',
          value: 4
        },
        {
          text: '德语',
          value: 5
        },
        {
          text: '西班牙语',
          value: 6
        }
      ]
    }
  },
  methods: {
    create () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      const program = {
        title: this.title,
        language: this.language,
        description: this.description
      }

      axios.post('/programs', program)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>

<style>
.step-container {
  margin-top: 64px;
}

.program-container {
  margin-bottom: 24px;
}
</style>
