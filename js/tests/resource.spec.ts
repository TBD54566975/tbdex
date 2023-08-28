import { expect } from 'chai'
import { Convert } from '@web5/common'
import { DevTools } from '../src/dev-tools.js'
import { Resource, Offering } from '../src/main.js'

describe('Resource', () => {
  describe('create', () => {
    it('creates a resource', async () => {
      const pfi = await DevTools.createDid()
      const offering = DevTools.createOffering()
      const resource = Resource.create({
        metadata : { from: pfi.did },
        data     : offering
      })

      expect(resource.id).to.exist
      expect(resource.id).to.include('offering_')
      expect(resource.data).to.be.instanceof(Offering)
    })
  })

  describe('validate', () => {
    it('throws an error if payload is not an object', () => {
      const testCases = ['hi', [], 30, ';;;)_', true, null, undefined]
      for (let testCase of testCases) {
        try {
          Resource.validate(testCase)
          expect.fail()
        } catch(e) {
          expect(e.message).to.include('must be object')
        }
      }
    })

    it('throws an error if required properties are missing', () => {
      try {
        Resource.validate({})
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('required property')
      }
    })
  })

  describe('sign', () => {
    it('sets signature property', async () => {
      const pfi = await DevTools.createDid()
      const offering = DevTools.createOffering()
      const resource = Resource.create({
        metadata : { from: pfi.did },
        data     : offering
      })

      const { privateKeyJwk } = pfi.keySet.verificationMethodKeys[0]
      const kid = pfi.document.verificationMethod[0].id
      await resource.sign(privateKeyJwk, kid)

      expect(resource.signature).to.not.be.undefined
      expect(typeof resource.signature).to.equal('string')
    })

    it('includes alg and kid in jws header', async () => {
      const pfi = await DevTools.createDid()
      const offering = DevTools.createOffering()
      const resource = Resource.create({
        metadata : { from: pfi.did },
        data     : offering
      })

      const { privateKeyJwk } = pfi.keySet.verificationMethodKeys[0]
      const kid = pfi.document.verificationMethod[0].id
      await resource.sign(privateKeyJwk, kid)

      const [base64UrlEncodedJwsHeader] = resource.signature.split('.')
      const jwsHeader = Convert.base64Url(base64UrlEncodedJwsHeader).toObject()

      expect(jwsHeader['kid']).to.equal(kid)
      expect(jwsHeader['alg']).to.exist
    })
  })

  describe('verify', () => {
    it('does not throw an exception if resource integrity is intact', async () => {
      const pfi = await DevTools.createDid()
      const offering = DevTools.createOffering()
      const resource = Resource.create({
        metadata : { from: pfi.did },
        data     : offering
      })

      const { privateKeyJwk } = pfi.keySet.verificationMethodKeys[0]
      const kid = pfi.document.verificationMethod[0].id
      await resource.sign(privateKeyJwk, kid)

      await resource.verify()
    })

    it('throws an error if no signature is present on the resource provided', async () => {
      const pfi = await DevTools.createDid()
      const offering = DevTools.createOffering()
      const resource = Resource.create({
        metadata : { from: pfi.did },
        data     : offering
      })

      try {
        await resource.verify()
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
        await Resource.parse(';;;)_')
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('not valid JSON')
      }
    })

    it('returns a Resource instance if parsing is successful', async () => {
      const pfi = await DevTools.createDid()
      const offering = DevTools.createOffering()
      const resource = Resource.create({
        metadata : { from: pfi.did },
        data     : offering
      })

      const { privateKeyJwk } = pfi.keySet.verificationMethodKeys[0]
      const kid = pfi.document.verificationMethod[0].id
      await resource.sign(privateKeyJwk, kid)

      const jsonResource = JSON.stringify(resource)
      const parsedResource = await Resource.parse(jsonResource)

      expect(jsonResource).to.equal(JSON.stringify(parsedResource))
    })
  })
})