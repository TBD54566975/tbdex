import { expect } from 'chai'
import { Offering } from '../src/types.js'
import { createMessage } from '../src/builders.js'

describe('Message builder', () => {
  it('can build an offering', () => {
    const offering: Offering = {
      description            : 'test offering',
      pair                   : 'USD_BTC',
      unitPrice              : '100',
      min                    : '0',
      max                    : '1000',
      presentationRequestJwt : 'testjwt',
      payinInstruments       : [],
      payoutInstruments      : []
    }

    console.log(createMessage('alice-did', 'pfi-did', offering, 'offering'))
    expect(createMessage('alice-did', 'pfi-did', offering, 'offering')).to.not.throw
  })
})