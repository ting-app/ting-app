<template>
  <div class="container">
    <Navigation></Navigation>
    <v-row justify="center">
      <v-col cols="8" class="ma-12">
        <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
        <v-tabs vertical>
          <v-tab>
            <v-icon left>
              mdi-account
            </v-icon>
            账户
          </v-tab>
          <v-tab-item>
            <v-card flat>
              <AccountSetting></AccountSetting>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import AccountSetting from '@/components/AccountSetting'

export default {
  name: 'Settings',
  components: {
    Navigation,
    AccountSetting
  },
  computed: {
    breadcrumbs () {
      const breadcrumbs = [
        {
          text: '首页',
          disabled: false,
          href: '/#/'
        },
        {
          text: '设置',
          disabled: true
        }
      ]

      return breadcrumbs
    }
  }
}
</script>
