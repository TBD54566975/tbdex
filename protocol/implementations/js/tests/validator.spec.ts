import { expect } from 'chai';

import { validateMessage } from '../src/validator.js'

const validMessage = {
    "id": "123",
    "contextId": "123",
    "from": "test",
    "to": "test",
    "dateCreated": 123,
    "type": "offering",
    "body": {
        "description": "Buy BTC with USD!",
        "pair": "BTC_USD",
        "unitPrice": "27000.0",
        "baseFee": "1.00",
        "min": "10.00",
        "max": "1000.00",
        "presentationRequestJwt": "eyJhb...MIDw",
        "payinInstruments": [
            {
                "kind": "DEBIT_CARD",
                "fee": {
                    "flatFee": 1.0
                }
            }
        ],
        "payoutInstruments": [
            {
                "kind": "BITCOIN_ADDRESS"
            }
        ]
    }
}

const invalidMessage = {
    "id": "123",
    "contextId": "123",
    "from": "test",
    "to": "test",
    "dateCreated": 123,
    "type": "rfq",
    "body": {
        "description": "Buy BTC with USD!",
        "pair": "BTC_USD",
        "unitPrice": "27000.0",
        "baseFee": "1.00",
        "min": "10.00",
        "max": "1000.00",
        "presentationRequestJwt": "eyJhb...MIDw",
        "payinInstruments": [
            {
                "kind": "DEBIT_CARD",
                "fee": {
                    "flatFee": 1.0
                }
            }
        ],
        "payoutInstruments": [
            {
                "kind": "BITCOIN_ADDRESS"
            }
        ]
    }
}

describe('validator', () => {
    it('throws error if payload does not conform to schema', () => {
        expect(() => validateMessage(invalidMessage)).to.throw;
    });
    it('does not throw if payload is valid', () => {
        expect(validateMessage(validMessage)).to.not.throw;
    });
});