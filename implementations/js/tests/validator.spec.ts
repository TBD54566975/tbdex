import { expect } from 'chai'

import { SchemaValidationError, validateMessage } from '../src/validator.js'

const validMessage = {
  'id': '123',
  'contextId': '123',
  'from': 'did:swanky:alice',
  'to': 'did:swanky:pfi',
  'createdTime': '2023-04-14T12:12:12Z',
  'type': 'offering',
  'body': {
    'description': 'Buy BTC with USD!',
    'pair': 'BTC_USD',
    'unitPrice': '27000.0',
    'baseFee': '1.00',
    'min': '10.00',
    'max': '1000.00',
    'presentationDefinitionJwt': 'eyJhb...MIDw',
    'payinInstruments': [
      {
        'kind': 'DEBIT_CARD',
        'fee': {
          'flatFee': '1.0'
        }
      }
    ],
    'payoutInstruments': [
      {
        'kind': 'BITCOIN_ADDRESS'
      }
    ]
  }
}

const mismatchedBody = {
  'id': '123',
  'contextId': '123',
  'from': 'did:swanky:alice',
  'to': 'did:swanky:pfi',
  'createdTime': '2023-04-14T12:12:12Z',
  'type': 'rfq',
  'body': {
    'orderStatus': 'PENDING'
  }
}

const invalidType = {
  'id': '123',
  'contextId': '123',
  'from': 'did:swanky:alice',
  'to': 'did:swanky:pfi',
  'createdTime': 'whateva',
  'type': 'blah',
  'body': {
    'orderStatus': 'PENDING'
  }
}

const missingField = {
  'id': '123',
  'contextId': '123',
  'from': 'did:swanky:alice',
  'to': 'did:swanky:pfi',
  'createdTime': '2023-04-14T12:12:12Z',
  'type': 'order',
  'body': {}
}

const numberAmounts = {
  'id': '123',
  'contextId': '123',
  'from': 'did:swanky:alice',
  'to': 'did:swanky:pfi',
  'createdTime': '2023-04-14T12:12:12Z',
  'type': 'offering',
  'body': {
    'description': 'Buy BTC with USD!',
    'pair': 'BTC_USD',
    'unitPrice': 27000.0,
    'baseFee': 1.00,
    'min': 10.00,
    'max': 1000.00,
    'presentationDefinitionJwt': 'eyJhb...MIDw',
    'payinInstruments': [
      {
        'kind': 'DEBIT_CARD',
        'fee': {
          'flatFee': 1.0
        }
      }
    ],
    'payoutInstruments': [
      {
        'kind': 'BITCOIN_ADDRESS'
      }
    ]
  }
}

describe('validator', () => {
  it('does not throw if payload is valid', () => {
    expect(validateMessage(validMessage)).to.not.throw
  })
  it('throws error if message type does not match body', () => {
    try {
      validateMessage(mismatchedBody)
      expect.fail()
    } catch (e) {
      expect(e).to.be.instanceOf(SchemaValidationError)
      expect(e.message).to.include('required')
    }
  })
  it('throws error if unrecognized message type is passed', () => {
    try {
      validateMessage(invalidType)
      expect.fail()
    } catch (e) {
      expect(e).to.be.instanceOf(SchemaValidationError)
      expect(e.message).to.include('allowed values')
    }
  })
  it('throws error if amount types are incorrect', () => {
    try {
      validateMessage(numberAmounts)
      expect.fail()
    } catch (e) {
      expect(e).to.be.instanceOf(SchemaValidationError)
      expect(e.message).to.include('must be')
    }
  })
  it('throws error if required fields are missing', () => {
    try {
      validateMessage(missingField)
      expect.fail()
    } catch (e) {
      expect(e).to.be.instanceOf(SchemaValidationError)
      expect(e.message).to.include('required')
    }
  })
})