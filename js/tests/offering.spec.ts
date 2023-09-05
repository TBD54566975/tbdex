import type { OfferingData } from '../src/main.js'

import { Offering } from '../src/main.js'
import { DevTools } from '../src/dev-tools.js'
import { Convert } from '@web5/common'
import { expect } from 'chai'

const offeringData: OfferingData = {
  description  : 'Selling BTC for USD',
  baseCurrency : {
    currencyCode : 'BTC',
    maxSubunits  : '99952611'
  },
  quoteCurrency: {
    currencyCode: 'USD'
  },
  quoteUnitsPerBaseUnit : '26043.40',
  payinMethods          : [{
    kind                   : 'DEBIT_CARD',
    requiredPaymentDetails : {
      $schema    : 'http://json-schema.org/draft-07/schema',
      type       : 'object',
      properties : {
        cardNumber: {
          type        : 'string',
          description : 'The 16-digit debit card number',
          minLength   : 16,
          maxLength   : 16
        },
        expiryDate: {
          type        : 'string',
          description : 'The expiry date of the card in MM/YY format',
          pattern     : '^(0[1-9]|1[0-2])\\/([0-9]{2})$'
        },
        cardHolderName: {
          type        : 'string',
          description : 'Name of the cardholder as it appears on the card'
        },
        cvv: {
          type        : 'string',
          description : 'The 3-digit CVV code',
          minLength   : 3,
          maxLength   : 3
        }
      },
      required             : ['cardNumber', 'expiryDate', 'cardHolderName', 'cvv'],
      additionalProperties : false
    }
  }],
  payoutMethods: [{
    kind                   : 'BTC_ADDRESS',
    requiredPaymentDetails : {
      $schema    : 'http://json-schema.org/draft-07/schema',
      type       : 'object',
      properties : {
        btcAddress: {
          type        : 'string',
          description : 'your Bitcoin wallet address'
        }
      },
      required             : ['btcAddress'],
      additionalProperties : false
    }
  }],
  requiredClaims: {
    id                : '7ce4004c-3c38-4853-968b-e411bafcd945',
    input_descriptors : [{
      id          : 'bbdb9b7c-5754-4f46-b63b-590bada959e0',
      constraints : {
        fields: [{
          path   : ['$.type'],
          filter : {
            type  : 'string',
            const : 'YoloCredential'
          }
        }]
      }
    }]
  }
}

describe('Offering', () => {
  describe('create', () => {
    it('creates a resource', async () => {
      const pfi = await DevTools.createDid()
      const offering = Offering.create({
        metadata : { from: pfi.did },
        data     : offeringData
      })

      expect(offering.id).to.exist
      expect(offering.id).to.include('offering_')
    })
  })

  describe('validate', () => {
    it('throws an error if payload is not an object', () => {
      const testCases = ['hi', [], 30, ';;;)_', true, null, undefined]
      for (let testCase of testCases) {
        try {
          Offering.validate(testCase)
          expect.fail()
        } catch(e) {
          expect(e.message).to.include('must be object')
        }
      }
    })

    it('throws an error if required properties are missing', () => {
      try {
        Offering.validate({})
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('required property')
      }
    })
  })

  describe('sign', () => {
    it('sets signature property', async () => {
      const pfi = await DevTools.createDid()
      const offering = Offering.create({
        metadata : { from: pfi.did },
        data     : offeringData
      })

      const { privateKeyJwk } = pfi.keySet.verificationMethodKeys[0]
      const kid = pfi.document.verificationMethod[0].id
      await offering.sign(privateKeyJwk, kid)

      expect(offering.signature).to.not.be.undefined
      expect(typeof offering.signature).to.equal('string')
    })

    it('includes alg and kid in jws header', async () => {
      const pfi = await DevTools.createDid()
      const offering = Offering.create({
        metadata : { from: pfi.did },
        data     : offeringData
      })

      const { privateKeyJwk } = pfi.keySet.verificationMethodKeys[0]
      const kid = pfi.document.verificationMethod[0].id
      await offering.sign(privateKeyJwk, kid)

      const [base64UrlEncodedJwsHeader] = offering.signature.split('.')
      const jwsHeader = Convert.base64Url(base64UrlEncodedJwsHeader).toObject()

      expect(jwsHeader['kid']).to.equal(kid)
      expect(jwsHeader['alg']).to.exist
    })
  })

  describe('verify', () => {
    it('does not throw an exception if resource integrity is intact', async () => {
      const pfi = await DevTools.createDid()
      const offering = Offering.create({
        metadata : { from: pfi.did },
        data     : offeringData
      })

      const { privateKeyJwk } = pfi.keySet.verificationMethodKeys[0]
      const kid = pfi.document.verificationMethod[0].id
      await offering.sign(privateKeyJwk, kid)

      await offering.verify()
    })

    it('throws an error if no signature is present on the resource provided', async () => {
      const pfi = await DevTools.createDid()
      const offering = Offering.create({
        metadata : { from: pfi.did },
        data     : offeringData
      })

      try {
        await offering.verify()
        expect.fail()
      } catch(e) {
        expect(e.message).to.include(`must have required property 'signature'`)
      }
    })

    xit('throws an error if signature is not a valid compact JWS')
    xit('throws an error if signature is payload is included in JWS')
    xit('throws an error if JWS header doesnt include alg and kid properties')
    xit('throws an error if DID in kid of JWS header doesnt match metadata.from in message')
    xit('throws an error if no verification method can be found in signers DID Doc')
    xit('throws an error if verification method does not include publicKeyJwk')

  })

  describe('parse', () => {
    it('throws an error if payload is not valid JSON', async () => {
      try {
        await Offering.parse(';;;)_')
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('Failed to parse resource')
      }
    })

    it('returns a Resource instance if parsing is successful', async () => {
      const pfi = await DevTools.createDid()
      const offering = Offering.create({
        metadata : { from: pfi.did },
        data     : offeringData
      })

      const { privateKeyJwk } = pfi.keySet.verificationMethodKeys[0]
      const kid = pfi.document.verificationMethod[0].id
      await offering.sign(privateKeyJwk, kid)

      const jsonResource = JSON.stringify(offering)
      const parsedResource = await Offering.parse(jsonResource)

      expect(jsonResource).to.equal(JSON.stringify(parsedResource))
    })
  })
})