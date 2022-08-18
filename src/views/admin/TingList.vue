<template>
  <div class="container">
    <Navigation></Navigation>
    <Overlay :loading="loading"></Overlay>
    <v-row justify="center" v-if="!loading">
      <v-col cols="9" class="ma-12">
        <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
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
        </div>
        <TingList v-if="program"></TingList>
      </v-col>
    </v-row>
    <CreateTing></CreateTing>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Overlay from '@/components/Overlay.vue'
import TingList from '@/components/TingList.vue'
import CreateTing from '@/components/CreateTing.vue'
import axios from '@/axios'
import eventBus from '@/event-bus'
import EventTypes from '@/event-types'

export default {
  name: 'TingListAdmin',
  components: {
    Overlay,
    Navigation,
    TingList,
    CreateTing
  },
  computed: {
    breadcrumbs () {
      const breadcrumbs = []

      if (this.program) {
        breadcrumbs.push({
          text: '首页',
          disabled: false,
          href: '/#/'
        })
        breadcrumbs.push({
          text: '我的节目',
          disabled: false,
          href: '/#/admin/programs'
        })
        breadcrumbs.push({
          text: this.program.title,
          disabled: true
        })
      }

      return breadcrumbs
    }
  },
  data () {
    return {
      loading: false,
      program: null
    }
  },
  methods: {
    createTing () {
      eventBus.$emit(EventTypes.CREATE_TING, this.program.id)
    }
  },
  created () {
    const programId = this.$route.params.programId

    this.loading = true

    Promise.all([
      axios.get(`/programs/${programId}`),
      axios.get('/users/me')
    ])
      .then((values) => {
        const program = values[0]
        const me = values[1]

        if (me === null) {
          this.$router.push('/login')
        } else if (program.createdBy !== me.id) {
          this.$toast.error('无权限访问')
        } else {
          this.program = program
        }
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
