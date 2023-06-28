import { expect } from 'chai'
import { Quote, Rfq, PaymentMethodKind } from '../src/types.js'
import { createMessage } from '../src/builders.js'

describe('Message builder', () => {
  it('can build an rfq', () => {
    const rfq: Rfq = {
      pair                      : 'USD_BTC',
      amount                    : '1000',
      verifiablePresentationJwt : 'fake-jwt',
      payinMethod               : {
        kind                             : PaymentMethodKind.DEBIT_CARD,
        paymentVerifiablePresentationJwt : ''
      },
      payoutMethod: {
        kind                             : PaymentMethodKind.BITCOIN_ADDRESS,
        paymentVerifiablePresentationJwt : ''
      }
    }

    const actual = createMessage({
      to   : 'alice-did',
      from : 'pfi-did',
      type : 'rfq',
      body : rfq
    })

    expect(actual.body).to.equal(rfq)
  })
  it('builds the expected message for an existing thread', () => {
    const rfq: Rfq = {
      pair                      : 'USD_BTC',
      amount                    : '1000',
      verifiablePresentationJwt : 'fake-jwt',
      payinMethod               : {
        kind                             : PaymentMethodKind.DEBIT_CARD,
        paymentVerifiablePresentationJwt : 'fake-debitcard-jwt'
      },
      payoutMethod: {
        kind                             : PaymentMethodKind.BITCOIN_ADDRESS,
        paymentVerifiablePresentationJwt : 'fake-btcaddress-jwt'
      }
    }

    const rfqMessage = createMessage({
      to   : 'pfi-did',
      from : 'alice-did',
      type : 'rfq',
      body : rfq
    })

    const quote: Quote = {
      expiryTime          : new Date().toISOString(),
      totalFee            : '100',
      amount              : '1000',
      paymentInstructions : {payin: {link: 'fake.link.com'}}
    }

    const {from, to, threadId, parentId} = createMessage({
      last : rfqMessage,
      type : 'quote',
      body : quote
    })

    expect(from).to.equal(rfqMessage.from)
    expect(to).to.equal(rfqMessage.to)
    expect(threadId).to.equal(rfqMessage.threadId)
    expect(parentId).to.equal(rfqMessage.id)
  })
})