import * as cbor from 'cbor-x'
import { sha256 } from '@noble/hashes/sha256'
import { Convert } from '@web5/common'
import { DidKeyMethod } from '@web5/dids'
import { Ed25519, Jose } from '@web5/crypto'

/**
 * hashes the payload provided in the following manner:
 * base64url(
 *  sha256(
 *    cbor(payload)
 *  )
 * )
 * TODO: add link to tbdex protocol hash section
 * @param payload - the payload to hash
 */
export function hash(payload: any) {
  const cborEncodedPayloadBuffer = cbor.encode(payload)
  const sha256CborEncodedPayloadBytes = sha256(cborEncodedPayloadBuffer)

  return Convert.uint8Array(sha256CborEncodedPayloadBytes).toBase64Url()
}

