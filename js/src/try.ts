import { Rfq } from './message-kinds/rfq.js'
import { Message } from './message.js'

const rfq = new Rfq({
  offeringId  : 'abcd123',
  payinMethod : {
    kind           : 'BTC_ADDRESS',
    paymentDetails : {
      address: '0x243234255'
    }
  },
  payoutMethod: {
    kind           : 'MOMO_MPESA',
    paymentDetails : {
      phoneNumber: '0123456789'
    }
  },
  quoteAmountSubunits : '0.0023124',
  vcs                 : ''
})

const message = Message.create({
  metadata: {
    from : 'did:ex:alice',
    to   : 'did:ex:pfi',
  },
  data: rfq,
})