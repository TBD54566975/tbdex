import { expect } from 'chai'
import { Offering, Quote, Rfq, PaymentMethodKind } from '../src/types.js'
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
      payinMethods           : [],
      payoutMethods          : []
    }

    const actual = createMessage({
      to   : 'alice-did',
      from : 'pfi-did',
      type : 'offering',
      body : offering
    })

    expect(actual.body).to.equal(offering)
  })
  it('builds the expected message for an existing thread', () => {
    const rfq: Rfq = {
      pair                      : 'USD_BTC',
      amount                    : '1000',
      verifiablePresentationJwt : 'fake-jwt',
      payinInstrument           : {
        kind: PaymentMethodKind.DEBIT_CARD
      },
      payoutInstrument: {
        kind: PaymentMethodKind.BITCOIN_ADDRESS
      }
    }

    const rfqMessage = createMessage({
      to   : 'pfi-did',
      from : 'alice-did',
      type : 'rfq',
      body : rfq
    })

    const quote: Quote = {
      expiryTime                    : new Date().toISOString(),
      totalFee                      : '100',
      amount                        : '1000',
      paymentPresentationRequestJwt : '',
      paymentInstructions           : {payin: {link: 'fake.link.com'}}
    }

    const {from, to, contextId} = createMessage({
      last : rfqMessage,
      type : 'quote',
      body : quote
    })

    expect(from).to.equal(rfqMessage.from)
    expect(to).to.equal(rfqMessage.to)
    expect(contextId).to.equal(rfqMessage.contextId)
  })
})