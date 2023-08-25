import type { JwsHeaderParams } from '@web5/crypto'

import { hash } from './crypto.js'
import * as cbor from 'cbor-x'
import { sha256 } from '@noble/hashes/sha256'
import { Convert } from '@web5/common'
import { DidKeyMethod } from '@web5/dids'
import { Ed25519, Jose } from '@web5/crypto'

import { Rfq } from './message-kinds/rfq.js'
import { Message } from './message.js'

const rfq = new Rfq({
  offeringId  : 'abcd123',
  payinMethod : {
    kind           : 'BTC_ADDRESS',
    paymentDetails : {
      address: '0x243234255'
    }
  },
  payoutMethod: {
    kind           : 'MOMO_MPESA',
    paymentDetails : {
      phoneNumber: '0123456789'
    }
  },
  quoteAmountSubunits : '0.0023124',
  vcs                 : ''
})

const message = Message.create({
  data     : rfq,
  metadata : {
    from : 'okee',
    to   : 'woohoo'
  },
  private: {}
})

const didState = await DidKeyMethod.create({ keyAlgorithm: 'Ed25519' })
const { privateKeyJwk } = didState.keySet.verificationMethodKeys[0]
const kid = didState.document.verificationMethod[0].id

await message.sign(privateKeyJwk, kid)
console.log(JSON.stringify(message, null, 2))