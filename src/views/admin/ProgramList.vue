<template>
  <div class="container">
    <Overlay :loading="loading"></Overlay>
    <Navigation></Navigation>
    <v-row justify="center">
      <v-col cols="9" class="ma-12">
        <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
        <v-simple-table v-if="programs.length > 0">
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
            <tr v-for="(program, index) in programs" :key="program.id">
              <td class="text-center">{{ program.title }}</td>
              <td class="text-center">{{ program.description }}</td>
              <td class="text-center">{{ format(program.createdAt) }}</td>
              <td class="text-center">{{ format(program.updatedAt) }}</td>
              <td class="text-center">
                <v-btn class="ma-2" @click="updateProgram(program)">编辑</v-btn>
                <v-btn color="error" class="ma-2" @click="deleteProgram(index, program.id)">删除</v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import axios from '@/axios'
import { formatDateTime } from '@/util'

export default {
  name: 'ProgramList',
  components: {
    Overlay,
    Navigation
  },
  computed: {
    me () {
      return this.$store.state.me
    },
    breadcrumbs () {
      const breadcrumbs = [
        {
          text: '首页',
          disabled: false,
          href: '/#/'
        },
        {
          text: '我的节目',
          disabled: true
        }
      ]

      return breadcrumbs
    }
  },
  data () {
    return {
      loading: false,
      programs: []
    }
  },
  methods: {
    format (dateTime) {
      return formatDateTime(dateTime)
    },
    updateProgram (program) {
    },
    deleteProgram (i, id) {
    }
  },
  created () {
    this.loading = true

    axios.get(`/programs?createdBy=${this.me.id}`)
      .then((response) => {
        this.programs = response
      })
      .catch((error) => {
        this.$toast.error(error.message)
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
