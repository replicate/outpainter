<template lang="pug">
.select-file
  input(
    @change="loadFile"
    type="file"
    ref="file"
    accept="image/*"
  )
  button.mb-4.text-white.bg-gray-400.font-medium.rounded-md.text-sm.w-full.px-5.py-3.text-center(
    @click="onSelectFile"
    class="sm:w-auto"
    type="submit"
  ) Upload an image
</template>

<script>
import { get } from 'lodash'

import { IMG_DIMENSIONS, IMG_PADDING, MASK_OVERLAP } from '@/config'

export default {
  name: 'Outpainter',
  props: ['image', 'mask', 'crop'],
  data: () => ({
    dropzone: null
  }),
  computed: {
    proxy_image: {
      get() {
        return this.image
      },
      set(value) {
        this.$emit('update:image', value)
      }
    },
    proxy_mask: {
      get() {
        return this.mask
      },
      set(value) {
        this.$emit('update:mask', value)
      }
    },
    proxy_crop: {
      get() {
        return this.crop
      },
      set(value) {
        this.$emit('update:crop', value)
      }
    }
  },
  methods: {
    onSelectFile() {
      this.$refs.file.click()
    },
    async loadFile(e) {
      this.proxy_image = null
      this.proxy_mask = null
      this.proxy_crop = null

      try {
        const file = get(e.target, 'files[0]', null)
        if (!file) return

        const image = new Image()
        const reader = new FileReader()
        reader.onload = (e) => (image.src = e.target.result)
        reader.readAsDataURL(file)

        image.onload = () => this.doCrop(image)
      } catch (e) {
        console.log(e)
      }
    },
    doCrop(image) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // Calculate the aspect ratio of the original image
      const aspectRatio = image.width / image.height
      let cropWidth, cropHeight, offsetX, offsetY

      if (aspectRatio >= 1) {
        cropWidth = image.height
        cropHeight = image.height
        offsetX = (image.width - cropWidth) / 2
        offsetY = 0
      } else {
        cropWidth = image.width
        cropHeight = image.width
        offsetX = 0
        offsetY = (image.height - cropHeight) / 2
      }

      // Set the canvas size
      canvas.width = 2 * IMG_PADDING + IMG_DIMENSIONS
      canvas.height = 2 * IMG_PADDING + IMG_DIMENSIONS

      // Fill the canvas with white color
      context.fillStyle = '#FFFFFF'
      context.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the cropped image onto the canvas
      context.drawImage(
        image,
        offsetX,
        offsetY,
        cropWidth,
        cropHeight,
        IMG_PADDING,
        IMG_PADDING,
        IMG_DIMENSIONS,
        IMG_DIMENSIONS
      )

      // Get the data URI of the cropped image
      const imageDataURI = canvas.toDataURL()
      this.proxy_image = imageDataURI

      // Create the mask
      const canvas_mask = document.createElement('canvas')
      const context_mask = canvas_mask.getContext('2d')
      canvas_mask.width = 2 * IMG_PADDING + IMG_DIMENSIONS
      canvas_mask.height = 2 * IMG_PADDING + IMG_DIMENSIONS
      context_mask.fillStyle = '#FFFFFF'
      context_mask.fillRect(0, 0, canvas_mask.width, canvas_mask.height)
      context_mask.fillStyle = '#000000'
      context_mask.fillRect(
        IMG_PADDING + MASK_OVERLAP,
        IMG_PADDING + MASK_OVERLAP,
        IMG_DIMENSIONS - 2 * MASK_OVERLAP,
        IMG_DIMENSIONS - 2 * MASK_OVERLAP
      )

      // Get the data URI of the mask
      const maskDataURI = canvas_mask.toDataURL()
      this.proxy_mask = maskDataURI

      // Create the crop (without padding)
      const canvas_crop = document.createElement('canvas')
      const context_crop = canvas_crop.getContext('2d')
      canvas_crop.width = IMG_DIMENSIONS
      canvas_crop.height = IMG_DIMENSIONS
      context_crop.drawImage(
        image,
        offsetX,
        offsetY,
        cropWidth,
        cropHeight,
        0,
        0,
        IMG_DIMENSIONS,
        IMG_DIMENSIONS
      )

      // Get the data URI of the crop
      const cropDataURI = canvas_crop.toDataURL()
      this.proxy_crop = cropDataURI

      this.$refs.file.value = null
    }
  },
  mounted() {
    try {
      const image = new Image()
      image.src = '/fox.png'
      image.onload = () => this.doCrop(image)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="stylus" scoped>
.select-file
  input[type="file"]
    display none
</style>
