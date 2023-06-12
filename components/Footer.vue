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
    a.inline-block.relative.w-12.h-12.mx-2.opacity-40.transition-all.duration-200(
      class="hover:opacity-100"
      href="https://replicate.com?utm_source=project&utm_campaign=outpainter"
    )
      img.p-3.transition-all.duration-200(
        src="/logomarks/replicate.svg"
        alt="Replicate"
        class="hover:p-1 hover:saturate-100"
      )
    a.inline-block.relative.w-12.h-12.mx-2.opacity-40.transition-all.duration-200(
      class="hover:opacity-100"
      href="https://vercel.com/templates/ai"
    )
      img.p-3.transition-all.duration-200(
        src="/logomarks/vercel.svg"
        alt="Vercel"
        class="hover:p-1 hover:saturate-100"
      )
    a.inline-block.relative.w-12.h-12.mx-2.opacity-40.transition-all.duration-200(
      class="hover:opacity-100"
      href="https://github.com/replicate/outpainter"
    )
      img.p-3.transition-all.duration-200(
        src="/logomarks/github.svg"
        alt="Fork it on GitHub"
        class="hover:p-1 hover:saturate-100"
      )
</template>

<style lang="stylus" scoped></style>
