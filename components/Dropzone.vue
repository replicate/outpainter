<template lang="pug">
form.dropzone
</template>

<script>
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'

export default {
  name: 'Outpainter',
  props: ['modelValue'],
  data: () => ({
    dropzone: null
  }),
  computed: {
    proxy: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  mounted() {
    this.dropzone = new Dropzone(this.$el, {
      disablePreviews: true,
      url: '/',
      maxFiles: 1,
      acceptedFiles: 'image/*',
      dictDefaultMessage: 'Drag and drop files here to upload.',
      createImageThumbnails: true,
      thumbnailWidth: 512,
      thumbnailHeight: 512,
      thumbnailMethod: 'crop',
      resize: (file, width, height, resizeMethod) => {
        let info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        }

        let srcRatio = file.width / file.height

        // Automatically calculate dimensions if not specified
        if (width == null && height == null) {
          width = info.srcWidth
          height = info.srcHeight
        } else if (width == null) {
          width = height * srcRatio
        } else if (height == null) {
          height = width / srcRatio
        }

        // Make sure images aren't upscaled
        width = Math.min(width, info.srcWidth)
        height = Math.min(height, info.srcHeight)

        let trgRatio = width / height

        if (info.srcWidth > width || info.srcHeight > height) {
          // Image is bigger and needs rescaling
          if (resizeMethod === 'crop') {
            if (srcRatio > trgRatio) {
              info.srcHeight = file.height
              info.srcWidth = info.srcHeight * trgRatio
            } else {
              info.srcWidth = file.width
              info.srcHeight = info.srcWidth / trgRatio
            }
          } else if (resizeMethod === 'contain') {
            // Method 'contain'
            if (srcRatio > trgRatio) {
              height = width / srcRatio
            } else {
              width = height * srcRatio
            }
          } else {
            throw new Error(`Unknown resizeMethod '${resizeMethod}'`)
          }
        }

        info.srcX = (file.width - info.srcWidth) / 2
        info.srcY = (file.height - info.srcHeight) / 2

        info.trgWidth = width
        info.trgHeight = height

        return info
      },
      thumbnail: async (file, dataURL) => {
        this.proxy = dataURL
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.dropzone
  width 100%
  max-width 256px
  aspect-ratio 1
  display flex
  align-items center

  border 1px solid rgba(0, 0, 0, .2)
  border-radius 3px
  color rgba(0, 0, 0, .6)

  &:hover
    background rgba(0, 0, 0, .02)
</style>
