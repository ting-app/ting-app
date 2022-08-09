<template>
  <div>
    <Overlay :loading="loading"></Overlay>
    <v-simple-table v-if="tings.length > 0" class="my-10">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-center">标题</th>
          <th class="text-center">描述</th>
          <th class="text-center">听力文件</th>
          <th class="text-center">创建时间</th>
          <th class="text-center">更新时间</th>
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(ting, index) in tings" :key="ting.id">
          <td class="text-center">{{ ting.title }}</td>
          <td class="text-center">{{ ting.description }}</td>
          <td class="text-center">{{ fileName(ting.audioUrl) }}</td>
          <td class="text-center">{{ format(ting.createdAt) }}</td>
          <td class="text-center">{{ format(ting.updatedAt) }}</td>
          <td class="text-center">
            <v-btn class="ma-2" @click="updateTing(ting)">编辑</v-btn>
            <v-btn color="error" class="ma-2" @click="deleteTing(index, ting.id)">删除</v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <UpdateTing></UpdateTing>
  </div>
</template>

<script>
import eventBus from '@/event-bus'
import Messages from '@/messages'
import axios from '@/axios'
import UnauthorizedError from '@/error/unauthorized-error'
import UpdateTing from '@/components/UpdateTing.vue'
import Overlay from '@/components/Overlay.vue'
import { formatDateTime } from '@/util'

export default {
  name: 'TingList',
  components: {
    Overlay,
    UpdateTing
  },
  data () {
    return {
      loading: false,
      tings: []
    }
  },
  methods: {
    format (dateTime) {
      return formatDateTime(dateTime)
    },
    fileName (audioUrl) {
      const indexOfSlash = audioUrl.lastIndexOf('/')

      return audioUrl.substring(indexOfSlash + 1)
    },
    tingCreated (ting) {
      this.tings.push(ting)
    },
    updateTing (ting) {
      eventBus.$emit(Messages.UPDATE_TING, ting)
    },
    tingUpdated (ting) {
      const index = this.tings.findIndex((it) => it.id === ting.id)

      if (index >= 0) {
        this.$set(this.tings, index, ting)
      }
    },
    deleteTing (i, id) {
      this.loading = true

      axios.delete(`/tings/${id}`)
        .then((response) => {
          this.$delete(this.tings, i)
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
    eventBus.$on(Messages.TING_CREATED, this.tingCreated)
    eventBus.$on(Messages.TING_UPDATED, this.tingUpdated)
  }
}
</script>
