<template lang="pug">
.flex.flex-col.justify-center.items-center
  .outpainter-outpaint.flex.justify-center.items-center(
    :style="`background-image: url(${output || cropDataURL});`"
    :class="{ expand: state == 'loading', expanded: state === 'output' }"
  )
    .blur(v-if="state === 'loading'")
    .outpainter-input(
      :style="`background-image: url(${cropDataURL})`"
    )
  input.block.w-full.flex-grow.rounded-l-md.p-2.my-4(
    v-model="prompt"
    class="max-w-[512px]"
    placeholder="Prompt"
    type="text"
  )
  SelectFile(
    @submit="doCreatePrediction"
    v-model:image="imageDataURL"
    v-model:mask="maskDataURL"
    v-model:crop="cropDataURL"
  )
</template>

<script>
import { mapActions } from 'pinia'

import useAppStore from '@/stores/app'
import { EventBus } from '@/services'

export default {
  name: 'Outpainter',
  data: () => ({
    state: null,
    output: null,

    imageDataURL: null,
    maskDataURL: null,
    cropDataURL: null,
    prompt: 'a painting of a fox'
  }),
  watch: {
    cropDataURL(value) {
      if (value) {
        this.state = null
        this.output = null
      }
    }
  },
  methods: {
    ...mapActions(useAppStore, ['createPrediction']),
    async predictionOutput(payload) {
      const image = new Image()
      image.src = payload
      image.onload = () => {
        this.state = 'output'
        this.output = payload
      }
    },
    async doCreatePrediction() {
      this.state = 'loading'
      this.output = null
      try {
        await this.createPrediction({
          input: {
            image: this.imageDataURL,
            mask: this.maskDataURL,
            prompt: this.prompt,
            guidance_scale: 7.5,
            num_inference_steps: 20,
            num_outputs: 1
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    EventBus.$on('prediction:output', this.predictionOutput)
  },
  beforeUnmount() {
    EventBus.$off('prediction:output', this.predictionOutput)
  }
}
</script>

<style lang="stylus" scoped>
@keyframes expand
  from
    max-width 256px

  to
    max-width 512px

.flex
  .outpainter-outpaint
    width 100%
    max-width 256px
    aspect-ratio 1
    background-position center
    background-repeat no-repeat
    background-size cover
    position relative
    border-radius 0.375rem
    overflow hidden

    &.expand
      animation expand 3s ease-in-out forwards

    &.expanded
      max-width 512px

    .blur
      width: 100%
      height 100%
      backdrop-filter blur(20px)
      position absolute

    .outpainter-input
      width 100%
      max-width 256px
      aspect-ratio 1
      z-index 10
</style>
