<template lang="pug">
transition(name="fade")
  img(
    v-bind:src="src"
    v-on:load="loaded = true"
    v-show="loaded"
  )
</template>

<script>
export default {
  name: 'Image',
  props: ['src'],
  data: () => ({
    loaded: false
  })
}
</script>

<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active
  transition opacity 3s ease-in-out

.fade-enter-from, .fade-leave-to
  opacity 0
</style>
