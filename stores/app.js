import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

import { WS } from '@/services'

export default defineStore('app', {
  state: () => ({
    ws_key: null
  }),
  actions: {
    reset() {
      this.ws_key = null
      WS.deinit()
    },
    async init() {
      try {
        const jobs = []
        const deferredJobs = []

        await Promise.allSettled(jobs)
        Promise.allSettled(deferredJobs)

        this.ws_key = uuidv4()
        WS.init(this.ws_key)
      } catch (e) {
        throw new Error(`Failed to init app (${e.message})`)
      }
    },
    async createPrediction(body = null) {
      const res = await fetch('/api/prediction', {
        method: 'post',
        body: JSON.stringify({
          ws_key: this.ws_key,
          ...body
        })
      })
      return await res.json()
    }
  }
})
