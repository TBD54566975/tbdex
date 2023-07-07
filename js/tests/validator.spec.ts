import type { Offering } from '../src/types.js'
import { expect } from 'chai'
import { SchemaValidationError, validateMessage } from '../src/validator.js'

const exampleKycRequirements = {
  'id'                : 'test-pd-id',
  'name'              : 'simple PD',
  'purpose'           : 'i am a smol PD',
  'input_descriptors' : [
    {
      'id'          : 'whatever',
      'purpose'     : 'to be a smol PD',
      'constraints' : {
        'fields': [
          {
            'path': [
              '$.credentialSubject.firstName',
            ]
          }
        ]
      }
    }
  ]
}

const validMessage = {
  'id'          : '123',
  'contextId'   : '123',
  'from'        : 'did:swanky:alice',
  'to'          : 'did:swanky:pfi',
  'createdTime' : '2023-04-14T12:12:12Z',
  'type'        : 'offering',
  'body'        : {
    'description'      : 'Buy BTC with USD!',
    'pair'             : 'BTC_USD',
    'unitPriceDollars' : '27000.0',
    'baseFeeDollars'   : '1.00',
    'minDollars'       : '10.00',
    'maxDollars'       : '1000.00',
    'kycRequirements'  : {},
    'payinMethods'     : [
      {
        'kind' : 'DEBIT_CARD',
        'fee'  : {
          'flatFee': '1.0'
        }
      }
    ],
    'payoutMethods': [
      {
        'kind'                   : 'BITCOIN_ADDRESS',
        'requiredPaymentDetails' : {}
      }
    ]
  }
}

const mismatchedBody = {
  'id'          : '123',
  'contextId'   : '123',
  'from'        : 'did:swanky:alice',
  'to'          : 'did:swanky:pfi',
  'createdTime' : '2023-04-14T12:12:12Z',
  'type'        : 'rfq',
  'body'        : {
    'orderStatus': 'PENDING'
  }
}

const invalidType = {
  'id'          : '123',
  'contextId'   : '123',
  'from'        : 'did:swanky:alice',
  'to'          : 'did:swanky:pfi',
  'createdTime' : 'whateva',
  'type'        : 'blah',
  'body'        : {
    'orderStatus': 'PENDING'
  }
}

const missingField = {
  'id'          : '123',
  'contextId'   : '123',
  'from'        : 'did:swanky:alice',
  'to'          : 'did:swanky:pfi',
  'createdTime' : '2023-04-14T12:12:12Z',
  'type'        : 'order',
  'body'        : {}
}

const numberAmounts = {
  'id'               : '123',
  'description'      : 'Buy BTC with USD!',
  'baseCurrency'     : 'BTC',
  'quoteCurrency'    : 'USD',
  'unitPriceDollars' : 27000.0,
  'createdTime'      : new Date().toISOString(),
  'baseFeeDollars'   : 1.00,
  'minDollars'       : 10.00,
  'maxDollars'       : 1000.00,
  'kycRequirements'  : exampleKycRequirements,
  'payinMethods'     : [
    {
      'kind' : 'DEBIT_CARD',
      'fee'  : {
        'flatFee': 1.0
      }
    }
  ],
  'payoutMethods': [
    {
      'kind': 'BITCOIN_ADDRESS'
    }
  ]
}

describe('validator', () => {
  xit('does not throw if payload is valid', () => {
    expect(validateMessage(validMessage)).to.not.throw
  })
  xit('throws error if message type does not match body', () => {
    try {
      validateMessage(mismatchedBody)
      expect.fail()
    } catch (e) {
      expect(e).to.be.instanceOf(SchemaValidationError)
      expect(e.message).to.include('required')
    }
  })
  xit('throws error if unrecognized message type is passed', () => {
    try {
      validateMessage(invalidType)
      expect.fail()
    } catch (e) {
      expect(e).to.be.instanceOf(SchemaValidationError)
      expect(e.message).to.include('allowed values')
    }
  })
  xit('throws error if amount types are incorrect', () => {
    try {
      validateMessage(numberAmounts)
      expect.fail()
    } catch (e) {
      expect(e).to.be.instanceOf(SchemaValidationError)
      expect(e.message).to.include('must be')
    }
  })
  xit('throws error if required fields are missing', () => {
    try {
      validateMessage(missingField)
      expect.fail()
    } catch (e) {
      expect(e).to.be.instanceOf(SchemaValidationError)
      expect(e.message).to.include('required')
    }
  })
})