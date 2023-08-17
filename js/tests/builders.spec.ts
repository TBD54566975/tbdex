import { type Quote, type Rfq, type TbDEXMessage } from '../src/types.js'

import { expect } from 'chai'
import { typeid } from 'typeid-js'
import { createMessage } from '../src/builders.js'

describe('messages builders', () => {
  it('can build an rfq', () => {
    const rfq: Rfq = {
      offeringId          : typeid('offering'),
      quoteAmountSubunits : '1000',
      vcs                 : 'fake-jwt',
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

    const actual = createMessage({
      to   : 'alice-did',
      from : 'pfi-did',
      type : 'rfq',
      body : rfq
    })

    expect(actual.body).to.equal(rfq)
    expect(actual.parentId).to.be.undefined
  })
  it('builds the expected message for an existing thread', () => {
    const rfq: Rfq = {
      offeringId          : typeid('offering'),
      quoteAmountSubunits : '1000',
      vcs                 : 'fake-jwt',
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

    const rfqMessage: TbDEXMessage<'rfq'> = createMessage({
      to   : 'pfi-did',
      from : 'alice-did',
      type : 'rfq',
      body : rfq
    })

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

    const { from, to, threadId, parentId, id } = createMessage({
      last : rfqMessage,
      type : 'quote',
      body : quote
    })

    expect(from).to.equal(rfqMessage.from)
    expect(to).to.equal(rfqMessage.to)
    expect(threadId).to.equal(rfqMessage.threadId)
    expect(parentId).to.equal(rfqMessage.id.toString())
    expect(id.toString()).to.contain('quote_')
  })
})
