<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">更新节目</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            v-if="program"
          >
            <v-text-field
              v-model="program.title"
              :counter="100"
              :rules="titleRules"
              label="标题*"
              required
            ></v-text-field>
            <v-select
              :items="languages"
              label="语言*"
              v-model="program.language"
            ></v-select>
            <v-textarea
              clearable
              clear-icon="mdi-close-circle"
              label="描述*"
              v-model="program.description"
              :counter="200"
              :rules="descriptionRules"
            ></v-textarea>
            <v-radio-group v-model="program.visible" row>
              <v-radio :value="true" label="公开"></v-radio>
              <v-radio :value="false" label="私有"></v-radio>
            </v-radio-group>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            :disabled="!valid || loading"
            :loading="loading"
            @click="update"
            class="ma-2"
          >
            更新
          </v-btn>
          <v-btn
            :disabled="loading"
            @click="close"
            class="ma-2"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import eventBus from '@/event-bus'
import EventTypes from '@/event-types'
import Languages from '@/languages'
import axios from '@/axios'
import UnauthorizedError from '@/error/unauthorized-error'

export default {
  name: 'UpdateProgram',
  data () {
    return {
      dialog: false,
      valid: true,
      program: null,
      loading: false,
      titleRules: [
        v => !!v || '标题不能为空',
        v => (v && v.length <= 100) || '标题不能超过100个字符'
      ],
      descriptionRules: [
        v => !!v || '描述不能为空',
        v => (v && v.length <= 200) || '描述不能超过200个字符'
      ],
      languages: Languages
    }
  },
  methods: {
    update () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      const program = {
        ...this.program
      }

      axios.put(`/programs/${program.id}`, program)
        .then((response) => {
          this.close()

          eventBus.$emit(EventTypes.PROGRAM_UPDATED, response)
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
    close () {
      this.$refs.form.reset()
      this.dialog = false
    }
  },
  created () {
    eventBus.$on(EventTypes.UPDATE_PROGRAM, (program) => {
      this.dialog = true
      this.program = {
        ...program
      }
    })
  }
}
</script>
