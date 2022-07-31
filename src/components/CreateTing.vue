<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">创建听写</span>
        </v-card-title>
        <v-card-text>
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
            <v-textarea
              clearable
              clear-icon="mdi-close-circle"
              label="描述*"
              v-model="description"
              :counter="200"
              :rules="descriptionRules"
            ></v-textarea>
            <v-textarea
              clearable
              clear-icon="mdi-close-circle"
              label="原文*"
              v-model="content"
              :counter="2000"
              :rules="contentRules"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="close"
          >
            取消
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="create"
          >
            创建
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import eventBus from '@/event-bus'

export default {
  name: 'CreateTing',
  data () {
    return {
      dialog: false,
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
      content: '',
      contentRules: [
        v => !!v || '原文不能为空',
        v => v.length <= 2000 || '原文不能超过2000个字符'
      ]
    }
  },
  methods: {
    close () {
      this.$refs.form.reset()
      this.dialog = false
    },
    create () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true
    }
  },
  mounted () {
    eventBus.$on('createTing', () => {
      this.dialog = true
    })
  }
}
</script>
