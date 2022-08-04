<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">更新听写</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            v-if="ting"
          >
            <v-text-field
              v-model="ting.title"
              :counter="100"
              :rules="titleRules"
              label="标题*"
              required
            ></v-text-field>
            <v-textarea
              clearable
              clear-icon="mdi-close-circle"
              label="描述*"
              v-model="ting.description"
              :counter="200"
              :rules="descriptionRules"
            ></v-textarea>
            <v-textarea
              clearable
              clear-icon="mdi-close-circle"
              label="原文*"
              v-model="ting.content"
              :counter="2000"
              :rules="contentRules"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!valid || loading"
            :loading="loading"
            @click="update"
          >
            更新
          </v-btn>
          <v-btn
            :disabled="loading"
            @click="close"
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
import axios from '@/axios'
import { BlobServiceClient } from '@azure/storage-blob'
import UnauthorizedError from '@/error/unauthorized-error'
import Messages from '@/messages'
import { randomFileName } from '@/util'

export default {
  name: 'UpdateTing',
  data () {
    return {
      dialog: false,
      valid: true,
      loading: false,
      titleRules: [
        v => !!v || '标题不能为空',
        v => (v && v.length <= 100) || '标题不能超过100个字符'
      ],
      descriptionRules: [
        v => !!v || '描述不能为空',
        v => (v && v.length <= 200) || '描述不能超过200个字符'
      ],
      contentRules: [
        v => !!v || '原文不能为空',
        v => (v && v.length <= 2000) || '原文不能超过2000个字符'
      ],
      ting: null
    }
  },
  methods: {
    close () {
      this.$refs.form.reset()
      this.dialog = false
    },
    update () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      const file = this.audioFile

      axios.get('/blobs/sas')
        .then((response) => {
          const fileName = randomFileName(file.name)
          const blobServiceClient = new BlobServiceClient(response)
          const containerClient = blobServiceClient.getContainerClient('')
          const blockBlobClient = containerClient.getBlockBlobClient(fileName)
          const fileUrl = response.substring(0, response.indexOf('?')) + '/' + fileName

          return blockBlobClient.uploadData(file)
            .then((_) => fileUrl)
        })
        .then((fileUrl) => {
          const ting = {
            programId: this.programId,
            title: this.title,
            description: this.description,
            content: this.content,
            audioUrl: fileUrl
          }

          return axios.post('/tings', ting)
        })
        .then((response) => {
          this.close()

          eventBus.$emit(Messages.TING_UPDATED, response)
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
    }
  },
  created () {
    eventBus.$on(Messages.UPDATE_TING, (ting) => {
      this.dialog = true
      this.ting = ting
    })
  }
}
</script>
