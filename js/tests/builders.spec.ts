import type { Quote, Rfq, TbDEXMessage } from '../src/types.js'

import { expect } from 'chai'
import { createMessage } from '../src/builders.js'

describe('messages builders', () => {
  it('can build an rfq', () => {
    const rfq: Rfq = {
      offeringId: '123',
      amountCents: '1000',
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
      amountCents: '1000',
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

    const rfqMessage: TbDEXMessage<'rfq'> = createMessage({
      to: 'pfi-did',
      from: 'alice-did',
      type: 'rfq',
      body: rfq
    })

    const quote: Quote = {
      expiryTime: new Date().toISOString(),
      totalFeeCents: '100',
      amountCents: '1000',
      paymentInstructions: { payin: { link: 'fake.link.com' } },
    }

    const { from, to, threadId, parentId } = createMessage({
      last: rfqMessage,
      type: 'quote',
      body: quote
    })

    expect(from).to.equal(rfqMessage.from)
    expect(to).to.equal(rfqMessage.to)
    expect(threadId).to.equal(rfqMessage.threadId)
    expect(parentId).to.equal(rfqMessage.id)
  })
})
