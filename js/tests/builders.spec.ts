import type { QuoteResponse, Rfq } from '../src/types.js'

import { expect } from 'chai'
import { createMessage } from '../src/builders.js'

describe('messages builders', () => {
  it('can build an rfq', () => {
    const rfq: Rfq = {
      offeringId: '123',
      amount: '1000',
      kycProof: 'fake-jwt',
      payinMethod: {
        kind: 'DEBIT_CARD',
        paymentVerifiablePresentationJwt: ''
      },
      payoutMethod: {
        kind: 'BITCOIN_ADDRESS',
        paymentVerifiablePresentationJwt: ''
      }
    }

    const actual = createMessage({
      to: 'alice-did',
      from: 'pfi-did',
      type: 'rfq',
      body: rfq
    })

    expect(actual.body).to.equal(rfq)
    expect(actual.parentId).to.be.null
  })
  it('builds the expected message for an existing thread', () => {
    const rfq: Rfq = {
      offeringId: '123',
      amount: '1000',
      kycProof: 'fake-jwt',
      payinMethod: {
        kind: 'DEBIT_CARD',
        paymentVerifiablePresentationJwt: 'fake-debitcard-jwt'
      },
      payoutMethod: {
        kind: 'BITCOIN_ADDRESS',
        paymentVerifiablePresentationJwt: 'fake-btcaddress-jwt'
      }
    }

    const rfqMessage = createMessage({
      to: 'pfi-did',
      from: 'alice-did',
      type: 'rfq',
      body: rfq
    })

    const quote = {
      expiryTime: new Date().toISOString(),
      totalFee: '100',
      amount: '1000',
      paymentInstructions: { payin: { link: 'fake.link.com' } },
    }

    const { from, to, threadId, parentId, body } = createMessage({
      last: rfqMessage,
      type: 'quoteResponse',
      body: { quote }
    })

    expect(from).to.equal(rfqMessage.from)
    expect(to).to.equal(rfqMessage.to)
    expect(threadId).to.equal(rfqMessage.threadId)
    expect(parentId).to.equal(rfqMessage.id)
    expect(body.error).to.be.undefined
  })
})
