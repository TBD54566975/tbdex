import { expect } from 'chai'
import { Offering } from '../src/types.js'
import { createMessage, createMessage2 } from '../src/builders.js'

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

    const tbdexMessage = createMessage2({
      'messageType' : 'offering',
      from          : 'did1',
      to            : 'did2',
      body          : offering,
    })

    console.log(tbdexMessage)

    console.log(createMessage('alice-did', 'pfi-did', offering, 'offering'))
    expect(createMessage('alice-did', 'pfi-did', offering, 'offering')).to.not.throw
  })
})