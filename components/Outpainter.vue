<template lang="pug">
.flex.justify-center.items-center
  Dropzone(
    v-if="true"
    v-model="dataURL"
  )
  .outpainter-outpaint.flex.justify-center.items-center(
    v-else
  )
    .outpainter-input
  img(
    v-if="dataURL"
    :src="dataURL"
  )
</template>

<script>
export default {
  name: 'Outpainter',
  data: () => ({
    dataURL: null
  })
}
</script>

<style lang="stylus" scoped>
.flex
  .outpainter-outpaint
    width 100%
    max-width 512px
    aspect-ratio 1
    background red

    .outpainter-input
      width 100%
      max-width 256px
      aspect-ratio 1
      background green
</style>
