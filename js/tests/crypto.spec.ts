import { expect } from 'chai'

import { DevTools, Crypto } from '../src/main.js'
import { Convert } from '@web5/common'
import { utils as didUtils } from '@web5/dids'

describe('Crypto', () => {
  describe('sign / verify', () => {
    it('works with did:ion', async () => {
      const alice = await DevTools.createDid('ion')
      const [ verificationMethodKey ] = alice.keySet.verificationMethodKeys
      const { privateKeyJwk } = verificationMethodKey

      const token = await Crypto.sign({
        privateKeyJwk,
        kid     : `${alice.did}#${privateKeyJwk.kid}`,
        payload : { timestamp: new Date().toISOString() }
      })

      await Crypto.verify({ signature: token })
    })

    it('works with did:key', async () => {
      const alice = await DevTools.createDid('key')
      const [ verificationMethodKey ] = alice.keySet.verificationMethodKeys
      const { privateKeyJwk } = verificationMethodKey

      const parsedDid = didUtils.parseDid({ didUrl: alice.did })
      const kid = `${alice.did}#${parsedDid.id}`

      const token = await Crypto.sign({
        privateKeyJwk,
        kid,
        payload: { timestamp: new Date().toISOString() }
      })

      await Crypto.verify({ signature: token })
    })

    it('works with detached content', async () => {
      const alice = await DevTools.createDid('ion')
      const [ verificationMethodKey ] = alice.keySet.verificationMethodKeys
      const { privateKeyJwk } = verificationMethodKey

      const payload = { timestamp: new Date().toISOString() }
      const base64urlEncodedPayload = Convert.object(payload).toBase64Url()

      const token = await Crypto.sign({
        privateKeyJwk,
        kid             : `${alice.did}#${privateKeyJwk.kid}`,
        detachedPayload : base64urlEncodedPayload
      })

      const did = await Crypto.verify({ signature: token, detachedPayload: base64urlEncodedPayload })
      expect(alice.did).to.equal(did)
    })
  })
})