import Replicate from 'replicate'

const replicate = new Replicate({
  auth: useRuntimeConfig().replicateApiToken
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ws_key, input } = body

  // https://replicate.com/stability-ai/stable-diffusion-inpainting
  const prediction = await replicate.predictions.create({
    version: 'c28b92a7ecd66eee4aefcd8a94eb9e7f6c3805d5f06038165407fb5cb355ba67',
    input,
    webhook: `https://r3swiuknhh.execute-api.eu-west-1.amazonaws.com/prod/webhook?key=${ws_key}`,
    webhook_events_filter: ['start', 'output', 'logs', 'completed']
  })

  return prediction
})
