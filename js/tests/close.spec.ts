import { Close, Message } from '../src/main.js'
import { expect } from 'chai'

describe('Close', () => {
  describe('create', () => {
    it('sets exchangeId to whatever is passed in', () => {
      const exchangeId = Message.generateId('rfq')
      const closeMessage = Close.create({
        metadata : { from: 'did:ex:alice', to: 'did:ex:pfi', exchangeId },
        data     : { reason: 'life is hard' }
      })

      expect(closeMessage.exchangeId).to.equal(exchangeId)
    })
  })
})