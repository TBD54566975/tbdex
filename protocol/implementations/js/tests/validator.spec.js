import { expect } from 'chai';
import { validateMessage } from '../src/validator.js';
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
};
const mismatchedBody = {
    "id": "123",
    "contextId": "123",
    "from": "test",
    "to": "test",
    "dateCreated": 123,
    "type": "rfq",
    "body": {
        "orderStatus": "PENDING"
    }
};
const invalidType = {
    "id": "123",
    "contextId": "123",
    "from": "test",
    "to": "test",
    "dateCreated": 123,
    "type": "blah",
    "body": {
        "orderStatus": "PENDING"
    }
};
const missingField = {
    "id": "123",
    "contextId": "123",
    "from": "test",
    "to": "test",
    "dateCreated": 123,
    "type": "order",
    "body": {}
};
const numberAmounts = {
    "id": "123",
    "contextId": "123",
    "from": "test",
    "to": "test",
    "dateCreated": 123,
    "type": "offering",
    "body": {
        "description": "Buy BTC with USD!",
        "pair": "BTC_USD",
        "unitPrice": 27000.0,
        "baseFee": 1.00,
        "min": 10.00,
        "max": 1000.00,
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
};
describe('validator', () => {
    it('does not throw if payload is valid', () => {
        expect(validateMessage(validMessage)).to.not.throw;
    });
    it('throws error if message type does not match body', () => {
        expect(() => validateMessage(mismatchedBody)).to.throw;
    });
    it('throws error if unrecognized message type is passed', () => {
        expect(() => validateMessage(invalidType)).to.throw;
    });
    it('throws error if amount types are incorrect', () => {
        expect(() => validateMessage(numberAmounts)).to.throw;
    });
    it('throws error if required fields are missing', () => {
        expect(() => validateMessage(missingField)).to.throw;
    });
});
