import { expect } from 'chai'
import { Convert } from '@web5/common'
import { DevTools } from '../src/dev-tools.js'
import { Message, OrderStatus, PfiRestClient, Rfq } from '../src/main.js'

describe('Message', () => {
  describe('create', () => {
    it('creates a message', async () => {
      const alice = await DevTools.createDid()
      const rfq = DevTools.createRfq()
      const message = Message.create({
        metadata : { from: alice.did, to: 'did:ex:pfi' },
        data     : rfq
      })

      expect(message.id).to.exist
      expect(message.exchangeId).to.exist
      expect(message.id).to.equal(message.exchangeId)
      expect(message.id).to.include('rfq_')
      expect(message.data).to.be.instanceof(Rfq)
    })

    it('creates a message for an existing thread', async () => {
      const alice = await DevTools.createDid()
      const rfq = DevTools.createRfq()
      const rfqMessage = Message.create({
        metadata : { from: alice.did, to: 'did:ex:pfi' },
        data     : rfq
      })

      const orderStatusMessage = Message.create({
        metadata : { from: 'did:ex:pfi', to: alice.did, exchangeId: rfqMessage.exchangeId },
        data     : new OrderStatus({orderStatus: 'test status'})
      })

      expect(orderStatusMessage.id).to.exist
      expect(orderStatusMessage.id).to.include('orderstatus')
      expect(orderStatusMessage.exchangeId).to.equal(rfqMessage.exchangeId)
    })
  })

  describe('validate', () => {
    it('throws an error if payload is not an object', () => {
      const testCases = ['hi', [], 30, ';;;)_', true, null, undefined]
      for (let testCase of testCases) {
        try {
          Message.validate(testCase)
          expect.fail()
        } catch(e) {
          expect(e.message).to.include('must be object')
        }
      }
    })

    it('throws an error if required properties are missing', () => {
      try {
        Message.validate({})
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('required property')
      }
    })
  })

  describe('sign', () => {
    it('sets signature property', async () => {
      const alice = await DevTools.createDid()
      const rfq = DevTools.createRfq()
      const message = Message.create({
        metadata : { from: alice.did, to: 'did:ex:pfi' },
        data     : rfq
      })

      const { privateKeyJwk } = alice.keySet.verificationMethodKeys[0]
      const kid = alice.document.verificationMethod[0].id
      await message.sign(privateKeyJwk, kid)

      expect(message.signature).to.not.be.undefined
      expect(typeof message.signature).to.equal('string')
    })

    it('includes alg and kid in jws header', async () => {
      const alice = await DevTools.createDid()
      const rfq = DevTools.createRfq()
      const message = Message.create({
        metadata : { from: alice.did, to: 'did:ex:pfi' },
        data     : rfq
      })

      const { privateKeyJwk } = alice.keySet.verificationMethodKeys[0]
      const kid = alice.document.verificationMethod[0].id
      await message.sign(privateKeyJwk, kid)

      const [base64UrlEncodedJwsHeader] = message.signature.split('.')
      const jwsHeader = Convert.base64Url(base64UrlEncodedJwsHeader).toObject()

      expect(jwsHeader['kid']).to.equal(kid)
      expect(jwsHeader['alg']).to.exist
    })
  })

  describe('verify', () => {
    it('does not throw an exception if message integrity is intact', async () => {
      const alice = await DevTools.createDid()
      const rfq = DevTools.createRfq()
      const message = Message.create({
        metadata : { from: alice.did, to: 'did:ex:pfi' },
        data     : rfq
      })

      const { privateKeyJwk } = alice.keySet.verificationMethodKeys[0]
      const kid = alice.document.verificationMethod[0].id
      await message.sign(privateKeyJwk, kid)

      await message.verify()
    })

    it('throws an error if no signature is present on the message provided', async () => {
      const alice = await DevTools.createDid()
      const rfq = DevTools.createRfq()
      const message = Message.create({
        metadata : { from: alice.did, to: 'did:ex:pfi' },
        data     : rfq
      })

      try {
        await message.verify()
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
        await Message.parse(';;;)_')
        expect.fail()
      } catch(e) {
        expect(e.message).to.include('Failed to parse message')
      }
    })

    it('returns an instance of Message if parsing is successful', async () => {
      const alice = await DevTools.createDid()
      const rfq = DevTools.createRfq()
      const message = Message.create({
        metadata : { from: alice.did, to: 'did:ex:pfi' },
        data     : rfq
      })

      const { privateKeyJwk } = alice.keySet.verificationMethodKeys[0]
      const kid = alice.document.verificationMethod[0].id
      await message.sign(privateKeyJwk, kid)

      const jsonMessage = JSON.stringify(message)
      const parsedMessage = await Message.parse(jsonMessage)

      expect(jsonMessage).to.equal(JSON.stringify(parsedMessage))
    })

    it.only('test bearer token', async () => {
      const alice = await DevTools.createDid('ion')
      const token = await PfiRestClient.bearerToken(alice.keySet.verificationMethodKeys[0].privateKeyJwk, alice.did)

      await PfiRestClient.verify(token)

      // const alicekey = await DevTools.createDid('key')
      // const keytoken = await PfiRestClient.bearerToken(alicekey.keySet.verificationMethodKeys[0].privateKeyJwk, alicekey.did)

      // await PfiRestClient.verify(keytoken)
    })
  })
})