<template>
  <v-overlay :value="loading" opacity="0">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'Overlay',
  props: {
    loading: {
      type: Boolean,
      default () {
        return false
      }
    }
  }
}
</script>
