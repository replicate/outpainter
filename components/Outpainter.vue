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
      :style="`background-image: url(${cropDataURL})`"
    )
    
  .prompt-input.my-5(
    class="max-w-[512px]"
  )
    input.block.w-full.flex-grow.rounded-l-md.p-3.border.border-gray-300.text-center(
      v-model="prompt"
      placeholder="Enter a text prompt"
      type="text"
    )
    button.text-white.bg-gray-900.font-medium.rounded-r-md.text-sm.w-full.px-5.py-3.text-center(
      @click="doCreatePrediction"
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
    width 50%
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
