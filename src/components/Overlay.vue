<template>
  <v-overlay :value="loading" opacity="0">
    <v-progress-circular
      indeterminate
      color="primary"
      size="100"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'Overlay',
  props: {
    loading: {
      type: Boolean
    }
  }
}
</script>
