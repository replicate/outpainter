<template lang="pug">
main.container.mx-auto.p-8(
  class="lg:p-10"
)
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
