<template lang="pug">
body.bg-gray-50
  main.container.mx-auto
    Header
    Outpainter
    Footer
</template>

<script>
import { mapActions } from 'pinia'

import useAppStore from '@/stores/app'

export default {
  name: 'App',
  methods: mapActions(useAppStore, ['init']),
  mounted() {
    this.init()
  }
}
</script>
