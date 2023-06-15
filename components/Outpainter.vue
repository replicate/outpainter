<template lang="pug">
.flex.flex-col.justify-center.items-center
  .outpainter.flex.justify-center.items-center(
    :class="{ loading: state === 'loading' }"
  )
    Image.outpainter-output(
      v-if="state === 'output'"
      :src="output"
    )
    .outpainter-input(
      :class="{ fade: state === 'output' }"
      :style="`background-image: url(${cropDataURL});width: ${relativeCropWidth * 100}%`"
    )
    
  .prompt-input.my-5(
    class="max-w-[512px]"
  )
    input.block.w-full.flex-grow.rounded-l-md.p-3.border.border-gray-300.text-center(
      v-model="prompt"
      @keydown.enter="doCreatePrediction"
      :disabled="state === 'loading'"
      placeholder="Enter a text prompt"
      type="text"
    )
    button.text-white.bg-gray-900.font-medium.rounded-r-md.text-sm.w-full.px-5.py-3.text-center(
      @click="doCreatePrediction"
      :disabled="state === 'loading'"
      class="sm:w-auto"
      type="submit"
    ) Paint
  SelectFile(
    v-model:image="imageDataURL"
    v-model:mask="maskDataURL"
    v-model:crop="cropDataURL"
  )
</template>

<script>
import { mapActions } from 'pinia'

import useAppStore from '@/stores/app'
import { EventBus } from '@/services'
import { IMG_DIMENSIONS, IMG_PADDING } from '@/config'

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
  computed: {
    relativeCropWidth() {
      return IMG_DIMENSIONS / (2 * IMG_PADDING + IMG_DIMENSIONS)
    }
  },
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
      image.crossOrigin = 'Anonymous'
      image.src = payload
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        // Set the canvas dimensions to match the loaded image
        canvas.width = image.width
        canvas.height = image.height

        // Draw the loaded image onto the canvas
        context.drawImage(image, 0, 0)

        // Load the initial image
        const initialImage = new Image()
        initialImage.src = this.cropDataURL

        initialImage.onload = () => {
          // Calculate the position to center the initial image on the merged canvas
          const relativeImageWidth = this.relativeCropWidth * canvas.width
          const relativeImageHeight = this.relativeCropWidth * canvas.height
          const x = (canvas.width - relativeImageWidth) / 2
          const y = (canvas.height - relativeImageHeight) / 2

          // Draw the intial image onto the merged canvas at the center position
          context.drawImage(
            initialImage,
            x,
            y,
            relativeImageWidth,
            relativeImageHeight
          )

          // Convert the merged canvas to a data URL
          const mergedDataURL = canvas.toDataURL()

          this.state = 'output'
          this.output = mergedDataURL
        }
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
    filter blur(0)

@keyframes fadeOut
  0%
    opacity 1
  100%
    opacity 0

.flex
  .outpainter
    width 100%
    aspect-ratio 1
    background-image url('/checkerboard.png')
    position relative
    overflow hidden

    &.loading
      animation toggleBlur 2s infinite

  .outpainter-output
    width 100%
    aspect-ratio 1
    position absolute

  .outpainter-input
    aspect-ratio 1
    background-position center
    background-repeat no-repeat
    background-size cover
    z-index 10
    position absolute

    &.fade
      animation fadeOut 2s forwards

  .prompt-input
    display flex
</style>
