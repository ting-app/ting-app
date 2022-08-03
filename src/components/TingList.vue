<template>
  <div>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-simple-table v-if="tings.length > 0">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-center">标题</th>
          <th class="text-center">描述</th>
          <th class="text-center">创建时间</th>
          <th class="text-center">更新时间</th>
          <th class="text-center">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(ting, index) in tings" :key="ting.id">
          <td class="text-center">{{ ting.title }}</td>
          <td class="text-center">{{ ting.description }}</td>
          <td class="text-center">{{ ting.createdAt }}</td>
          <td class="text-center">{{ ting.updatedAt }}</td>
          <td class="text-center">
            <v-btn class="ma-2">编辑</v-btn>
            <v-btn color="error" class="ma-2" @click="deleteTing(index, ting.id)">删除</v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import eventBus from '@/event-bus'
import Messages from '@/messages'
import axios from '@/axios'
import UnauthorizedError from '@/error/unauthorized-error'

export default {
  name: 'TingList',
  data () {
    return {
      loading: false,
      tings: []
    }
  },
  methods: {
    tingCreated (ting) {
      this.tings.push(ting)
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
  }
}
</script>
