import { TbDEXResource, MessageMetadata, TbDEXMessage, Status, PresentationDefinitionV2 } from './src/types.js'


const presentationDefinition: PresentationDefinitionV2 = {
  'id'                : '2eddf25f-f79f-4105-ac81-544c988f6d78',
  'name'              : 'Core Personal Identity Claims',
  'purpose'           : 'Claims for PFI to evaluate Alice',
  'input_descriptors' : [
    {
      'id'          : '707585e4-3d74-49e7-b21e-a8e1cbf8e31b',
      'purpose'     : 'Claims for PFI to evaluate Alice',
      'constraints' : {
        'subject_is_issuer' : 'required',
        'fields'            : [
          {
            'path'   : ['$.credentialSubject.givenName'],
            'filter' : {
              'type': 'string'
            }
          },
          {
            'path'   : ['$.credentialSubject.familyName'],
            'filter' : {
              'type': 'string'
            }
          }
        ]
      }
    }
  ]
}

const btcPaymentSchema = {
  '$schema'  : 'http://json-schema.org/draft-07/schema#',
  'title'    : 'BTC Required Payment Details',
  'type'     : 'object',
  'required' : [
    'btcAddress'
  ],
  'additionalProperties' : false,
  'properties'           : {
    'btcAddress': {
      'description' : 'The address you wish to receive BTC in',
      'type'        : 'string'
    }
  }
}

const _offering: TbDEXResource<'offering'> = {
  id                    : '123',
  description           : 'Buy BTC with USD!',
  quoteUnitsPerBaseUnit : '27000.00',
  baseCurrency          : {
    currencyCode : 'BTC',
    minSubunit   : '1000',
    maxSubunit   : '100000000'
  },
  quoteCurrency: {
    currencyCode : 'USD',
    minSubunit   : '1000',
    maxSubunit   : '1000'
  },
  kycRequirements: {
    id                : 'kyc',
    input_descriptors : [presentationDefinition]
  },
  payinMethods: [{
    kind        : 'CASHAPP_PAY',
    feeSubunits : '100'
  }],
  payoutMethods: [{
    kind                   : 'BTC_ADDRESS',
    requiredPaymentDetails : btcPaymentSchema,
  }],
  createdTime: '2023-06-27T12:34:56Z'
}



const _metadata: MessageMetadata = {
  id          : '123',
  threadId    : 'fdsal',
  parentId    : 'rgsrew',
  from        : 'did:ion:fdsjaklfdsa',
  to          : 'did:ion:teuwoipew',
  createdTime : '2023-06-26T12:34:56Z'
}


const _rfq: TbDEXMessage<'rfq'> = {
  ..._metadata,
  type : 'rfq',
  body : {
    offeringId          : '1',
    quoteAmountSubunits : '1000',
    kycProof            : 'eyJApQf...wqfVkg', // KYC VP in JWT format
    payinMethod         : {
      kind: 'CASHAPP_PAY'
    },
    payoutMethod: {
      kind           : 'BTC_ADDRESS',
      paymentDetails : {
        btcAddress: 'bc1dahklrjeaklf'
      }
    }
  }

}

const _quote: TbDEXMessage<'quote'> = {
  ..._metadata,
  type : 'quote',
  body : {
    expiryTime : '2023-06-26T12:44:56Z',
    base       : {
      currencyCode   : 'BTC',
      amountSubunits : '33333'
    },
    quote: {
      currencyCode   : 'USD',
      amountSubunits : '1000',
      feeSubunits    : '100'
    },
    paymentInstructions: {
      payin: {
        link: 'cashapp-pay.com?for=alice&amount=10'
      }
    }
  }

}

const _status: TbDEXMessage<'orderStatus'> = {
  ..._metadata,
  type : 'orderStatus',
  body : {
    orderStatus: Status.PAYIN_INITIATED
  }
}