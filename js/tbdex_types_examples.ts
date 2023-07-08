import { PaymentMethodKind, TbDEXResource, MessageMetadata, TbDEXMessage, Status } from './src/types.js'

const _offering: TbDEXResource<'offering'> = {
  id              : '123',
  description     : 'Buy BTC with USD!',
  baseCurrency    : 'BTC',
  quoteCurrency   : 'USD',
  unitPrice       : '27000.00',
  baseFee         : '1.00',
  min             : '10.00',
  max             : '1000.00',
  // here's what we want to see in your KYC VC (full name, dob)
  // maybe this is a sanctions VC? or maybe this is a silly VC that says 'send me a selfie'
  kycRequirements : 'eyJhb...MIDw',
  payinMethods    : [{
    kind                             : PaymentMethodKind.DEBIT_CARD,
    // here's how to present your debit card info
    paymentpresentationDefinitionJwt : 'ey...IAbZ',
    fee                              : {
      flatFee: '1.00'
    }
  }],
  payoutMethods: [{
    kind                             : PaymentMethodKind.BITCOIN_ADDRESS,
    // how to present your BTC address info
    paymentpresentationDefinitionJwt : 'ey...EbqW',
  }],
  createdTime: '2023-06-27T12:34:56Z'
}


const _metadata: MessageMetadata = {
  id          : '123',
  threadId    : 'fdsal',
  parentId    : 'rgsrew',
  from        : 'did:ion:fdsjaklfdsa',
  to          : 'did:ion:teuwoipew',
  createdTime : '2023-06-26T12:34:31Z'
}


const _rfq: TbDEXMessage<'rfq'> = {
  ..._metadata,
  type : 'rfq',
  body : {
    baseCurrency  : 'BTC',
    quoteCurrency : 'USD',
    amount        : '10.00',
    kycProof      : 'eyJApQf...wqfVkg', // heres my KYC VC
    payinMethod   : {
      kind                             : PaymentMethodKind.DEBIT_CARD,
      paymentVerifiablePresentationJwt : 'fdsafjdla'
    },
    payoutMethod: {
      kind                             : PaymentMethodKind.BITCOIN_ADDRESS,
      paymentVerifiablePresentationJwt : 'rewhiroew'
    }
  }

}

const _quote: TbDEXMessage<'quote'> = {
  ..._metadata,
  type : 'quote',
  body : {
    expiryTime          : '2023-04-14T12:12:12Z',
    totalFee            : '2.00',
    amount              : '0.000383',
    paymentInstructions : {
      payin: {
        link: 'stripe.com?for=alice&amount=10'
      }
    }
  }

}

const _status: TbDEXMessage<'orderStatus'> = {
  ..._metadata,
  type : 'orderStatus',
  body : {
    orderStatus: Status.PENDING
  }
}
