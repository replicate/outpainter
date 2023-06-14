<template lang="pug">
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
  setup() {
    useHead({
      bodyAttrs: {
        class: 'bg-gray-50'
      }
    })
  },
  methods: mapActions(useAppStore, ['init']),
  mounted() {
    this.init()
  }
}
</script>
