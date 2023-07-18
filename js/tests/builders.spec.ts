import { Close, type Quote, type Rfq, type TbDEXMessage } from '../src/types.js'

import { expect } from 'chai'
import { typeid } from 'typeid-js'
import { createMessageDumb, createMessageSmart } from '../src/builders.js'

describe('messages builders', () => {
  it('can build an rfq', () => {
    const actual = createMessageDumb({
      to   : 'alice-did',
      from : 'pfi-did',
      type : 'rfq',
      body : rfq
    })

    expect(actual.body).to.equal(rfq)
    expect(actual.parentId).to.be.undefined
  })
  it('builds the expected message for an existing thread', () => {
    const rfqMessage: TbDEXMessage<'rfq'> = createMessageDumb({
      to   : 'pfi-did',
      from : 'alice-did',
      type : 'rfq',
      body : rfq
    })

    // in the dumb version, to/from are always required, even when responding to an existing thread
    const quoteMessage = createMessageDumb({
      last : rfqMessage,
      to   : rfqMessage.from,
      from : rfqMessage.to,
      type : 'quote',
      body : quote
    })

    expect(quoteMessage.from).to.equal(rfqMessage.to)
    expect(quoteMessage.to).to.equal(rfqMessage.from)
    expect(quoteMessage.threadId).to.equal(rfqMessage.threadId)
    expect(quoteMessage.parentId).to.equal(rfqMessage.id.toString())
    expect(quoteMessage.id.toString()).to.contain('quote_')

    // simulates PFI closing a quote after it's been sent
    const closeMessage: TbDEXMessage<'close'> = createMessageDumb( {
      last : quoteMessage,
      type : 'close',
      body : close,
      to   : quoteMessage.to,
      from : quoteMessage.from
    })
    expect(closeMessage.to).to.equal(quoteMessage.to)
    expect(closeMessage.from).to.equal(quoteMessage.from)
  })

  it('shows how create message smart works', () => {
    const rfqMessage: TbDEXMessage<'rfq'> = createMessageSmart({
      to   : 'pfi-did',
      from : 'alice-did',
      type : 'rfq',
      body : rfq
    })

    const quoteMessage: TbDEXMessage<'quote'> = createMessageSmart( {
      type : 'quote',
      body : quote,
      last : rfqMessage
    })

    expect(quoteMessage.from).to.equal(rfqMessage.to)
    expect(quoteMessage.to).to.equal(rfqMessage.from)

    // no intellisense warning that you need to pass to/from for a close message
    const closeMessage: TbDEXMessage<'close'> = createMessageSmart( {
      type : 'close',
      body : close,
      last : quoteMessage
    })

    // fails because we didnt pass to/from, so it is undefined on closeMessage
    expect(closeMessage.to).to.equal(quoteMessage.to)
  })
})

const rfq: Rfq = {
  offeringId          : typeid('offering'),
  quoteAmountSubunits : '1000',
  kycProof            : 'fake-jwt',
  payinMethod         : {
    kind: 'APPLE_PAY',
  },
  payoutMethod: {
    kind           : 'BTC_ADDRESS',
    paymentDetails : {
      btcAddress: 'abcd123'
    }
  }
}

const quote: Quote = {
  expiryTime : new Date().toISOString(),
  base       : {
    currencyCode   : 'BTC',
    amountSubunits : '33333'
  },
  quote: {
    currencyCode   : 'USD',
    amountSubunits : '1000',
    feeSubunits    : '100'
  },
  paymentInstructions: { payin: { link: 'fake.link.com' } },
}

const close: Close = {
  reason: 'test'
}
