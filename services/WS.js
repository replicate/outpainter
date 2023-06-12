import { get } from 'lodash'
import rwp from 'replicate-webhook-proxy'

import { EventBus } from '@/services'

class WS {
  constructor() {
    this.client = null
  }

  init(key) {
    this.client = rwp(key)

    // Setup event listeners
    this.client.on('open', () => console.log('ws: open'))
    this.client.on('close', () => console.log('ws: close'))
    this.client.on('message', (event) => this.onmessage(event))
    this.client.on('error', (event) => console.log('ws: error', event.message))
  }

  deinit() {
    this.client.close()
    this.client = null
  }

  onmessage(event) {
    const { body } = event.data
    const output = get(body, 'output[0]', null)

    if (output) EventBus.$emit('prediction:output', output)
  }
}

export default new WS()
