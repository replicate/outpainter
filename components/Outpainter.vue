<template lang="pug">
.flex.flex-col.justify-center.items-center
    .outpainter-outpaint.flex.justify-center.items-center(
      :style="`background-image: url(${output || '/checkerboard.png'});`",
      :class="{ loading: state === 'loading', loaded: state === 'output' }"
    )
      .outpainter-input(
        :style="`background-image: url(${cropDataURL})`"
      )
      
    input.block.w-full.flex-grow.rounded-l.rounded-l-md.p-3.my-4.border.border-gray-300.text-center(
      v-model="prompt"
      class="max-w-[512px]"
      placeholder="Enter a text prompt"
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
@keyframes toggleBlur
  0%
    filter blur(0)
  50% 
    filter blur(10px)
  100%
    filter: blur(0)

.flex
  .outpainter-outpaint
    width 100%
    aspect-ratio 1
    position relative
    overflow hidden
    
    &.loading
      animation: toggleBlur 2s infinite;

    &.loaded
      background-position center
      background-repeat no-repeat
      background-size cover

  .outpainter-input
    width 50%
    aspect-ratio 1
    z-index 10
</style>
