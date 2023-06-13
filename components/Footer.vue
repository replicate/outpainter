<template lang="pug">
footer.mt-20
  .text-center
    | Outpainter is an open-source project from 
    a.underline(
      href="https://replicate.com?utm_source=project&utm_campaign=outpainter"
      target="_blank"
    ) Replicate
    | .
  nav.text-center.mt-16
    Popper(
      content="Built by Replicate"
      placement="top"
      hover
    )
      a(
        :class="linkStyle"
        href="https://replicate.com?utm_source=project&utm_campaign=outpainter"
      )
        img(
          :class="imageStyle"
          src="/logomarks/replicate.svg"
          alt="Replicate"
        )
    Popper(
      content="Hosted on Vercel"
      placement="top"
      hover
    )
      a(
        :class="linkStyle"
        href="https://vercel.com/templates/ai"
      )
        img(
          :class="imageStyle"
          src="/logomarks/vercel.svg"
          alt="Vercel"
        )
    Popper(
      content="Fork it on GitHub"
      placement="top"
      hover
    )
      a(
        :class="linkStyle"
        href="https://github.com/replicate/outpainter"
      )
        img(
          :class="imageStyle"
          src="/logomarks/github.svg"
          alt="Fork it on GitHub"
        )
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  data: () => ({
    linkStyle:
      'inline-block relative w-12 h-12 mx-2 opacity-40 transition-all duration-200 hover:opacity-100',
    imageStyle: 'p-3 transition-all duration-200 hover:p-1 hover:saturate-100'
  })
}
</script>

<style lang="stylus" scoped></style>
