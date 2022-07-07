<template>
  <div class="container">
    <Navigation></Navigation>
    <v-row justify="center" class="program-form">
      <v-col cols="4">
        <div class="display-1 text-center">创建节目</div>
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
              :disabled="!valid"
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
      valid: true,
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

      const program = {
        title: this.title,
        language: this.language,
        description: this.description
      }

      console.log(program)
    },
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>

<style>
.program-form {
  margin-top: 128px;
}
</style>
