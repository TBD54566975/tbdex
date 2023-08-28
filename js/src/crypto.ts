import type { MessageModel, ResourceModel } from './types.js'
import type {
  PrivateKeyJwk as Web5PrivateKeyJwk,
  CryptoAlgorithm,
  Web5Crypto,
  JwsHeaderParams
} from '@web5/crypto'

import * as cbor from 'cbor-x'
import { sha256 } from '@noble/hashes/sha256'
import { Convert } from '@web5/common'
import { EcdsaAlgorithm, EdDsaAlgorithm, Jose } from '@web5/crypto'
import { deferenceDidUrl, isVerificationMethod } from './did-resolver.js'

/**
 * options passed to {@link Crypto.sign}
 */
export type SignOptions = {
  /** the message or resource to sign */
  entity: MessageModel | ResourceModel,
  /** the key to sign with */
  privateKeyJwk: Web5PrivateKeyJwk,
  /** the kid to include in the jws header. used by the verifier to select the appropriate verificationMethod
   * when dereferencing the signer's DID
   */
  kid: string
}

/**
 * options passed to {@link Crypto.verify}
 */
export type VerifyOptions = {
  /** the message or resource to verify the signature of */
  entity: MessageModel | ResourceModel
}

export class Crypto {
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
  static hash(payload: any) {
    const cborEncodedPayloadBuffer = cbor.encode(payload)
    const sha256CborEncodedPayloadBytes = sha256(cborEncodedPayloadBuffer)

    return Convert.uint8Array(sha256CborEncodedPayloadBytes).toBase64Url()
  }

  /**
   * signs the message as a compact jws with detached content and sets the signature property
   * @param privateKeyJwk - the key to sign with
   * @param kid - the kid to include in the jws header. used by the verifier to select the appropriate verificationMethod
   *              when dereferencing the signer's DID
   * @returns the compact JWS
   */
  static async sign(opts: SignOptions) {
    const { entity, privateKeyJwk, kid } = opts

    const jwsHeader: JwsHeader = { alg: privateKeyJwk.alg as PrivateKeyJwk['alg'], kid }
    const base64UrlEncodedJwsHeader = Convert.object(jwsHeader).toBase64Url()

    const jwsPayload = { metadata: entity.metadata, data: entity.data }
    const base64urlEncodedJwsPayload = Crypto.hash(jwsPayload)

    const toSign = `${base64UrlEncodedJwsHeader}.${base64urlEncodedJwsPayload}`
    const toSignBytes = Convert.string(toSign).toUint8Array()

    const { signer, options } = signers[privateKeyJwk.alg]
    const key = await Jose.jwkToCryptoKey({ key: privateKeyJwk as Web5PrivateKeyJwk })

    const signatureBytes = await signer.sign({ key, data: toSignBytes, algorithm: options })
    const base64UrlEncodedSignature = Convert.uint8Array(signatureBytes).toBase64Url()

    // compact JWS with detached content: https://datatracker.ietf.org/doc/html/rfc7515#appendix-F
    return `${base64UrlEncodedJwsHeader}..${base64UrlEncodedSignature}`
  }

  /**
   * verifies the cryptographic integrity of the message or resource's signature
   * @param opts - verification options
   * @throws if no signature present on the message or resource
   * @throws if the signature is not a valid compact JWS
   * @throws if the JWS' content is not detached
   * @throws if the JWS header does not contain alg and kid
   * @throws if DID in kid of JWS header does not match metadata.from
   * @throws if signer's DID cannot be resolved
   * @throws if signer's DID Document does not have the necessary verification method
   * @throws if the verification method does not include a publicKeyJwk
   */
  static async verify(opts: VerifyOptions) {
    const { entity } = opts

    if (!entity.signature) {
      throw new Error('Signature verification failed: Expected signature property to exist')
    }

    const splitJws = entity.signature.split('.')
    if (splitJws.length !== 3) { // ensure that JWS has 3 parts
      throw new Error('Signature verification failed: Expected valid JWS with detached content')
    }

    const [base64UrlEncodedJwsHeader, detachedPayload, base64UrlEncodedSignature] = splitJws
    if (detachedPayload.length !== 0) { // ensure that JWS payload is empty
      throw new Error('Signature verification failed: Expected valid JWS with detached content')
    }

    const jwsHeader = Convert.base64Url(base64UrlEncodedJwsHeader).toObject() as JwsHeader
    if (!jwsHeader.alg || !jwsHeader.kid) { // ensure that JWS header has required properties
      throw new Error('Signature verification failed: Expected JWS header to contain alg and kid')
    }

    const [did] = (jwsHeader.kid as string).split('#')
    if (entity.metadata.from !== did) { // ensure that DID used to sign matches `from` property in metadata
      throw new Error('Signature verification failed: Expected DID in kid of JWS header must match metadata.from')
    }

    const verificationMethod = await deferenceDidUrl(jwsHeader.kid as string)
    if (!isVerificationMethod(verificationMethod)) { // ensure that appropriate verification method was found
      throw new Error('Signature verification failed: Expected kid in JWS header to dereference to a DID Document Verification Method')
    }

    // will be used to verify signature
    const { publicKeyJwk } = verificationMethod
    if (!publicKeyJwk) { // ensure that Verification Method includes public key as a JWK.
      throw new Error('Signature verification failed: Expected kid in JWS header to dereference to a DID Document Verification Method with publicKeyJwk')
    }

    // create jws payload
    const jwsPayload = { metadata: entity.metadata, data: entity.data }
    const base64urlEncodedJwsPayload = Crypto.hash(jwsPayload)

    const signedData = `${base64UrlEncodedJwsHeader}.${base64urlEncodedJwsPayload}`
    const signedDataBytes = Convert.string(signedData).toUint8Array()

    const signatureBytes = Convert.base64Url(base64UrlEncodedSignature).toUint8Array()

    const { signer, options } = signers[publicKeyJwk.alg]

    // TODO: remove this monkeypatch once 'ext' is no longer a required property within a jwk passed to `jwkToCryptoKey`
    const monkeyPatchPublicKeyJwk = {
      ...publicKeyJwk,
      ext     : 'true' as const,
      key_ops : ['verify']
    }

    const key = await Jose.jwkToCryptoKey({ key: monkeyPatchPublicKeyJwk })
    const isLegit = signer.verify({ algorithm: options, key, data: signedDataBytes, signature: signatureBytes })

    if (!isLegit) {
      throw new Error('Signature verification failed: Integrity mismatch')
    }
  }
}

// TODO: remove this monkey-patch after https://github.com/TBD54566975/web5-js/pull/175 is merged
type JwsHeader = Omit<JwsHeaderParams, 'alg'> & { alg: JwsHeaderParams['alg'] | 'EdDSA' }
type PrivateKeyJwk = Omit<Web5PrivateKeyJwk, 'alg'> & { alg: JwsHeaderParams['alg'] | 'EdDSA' }

/** supported cryptographic algorithms */
const signers: { [alg: string]: SignerValue<Web5Crypto.EcdsaOptions | Web5Crypto.EdDsaOptions> } = {
  'ES256K': {
    signer  : new EcdsaAlgorithm(),
    options : { name: 'ECDSA', hash: 'SHA-256' }
  },
  'EdDSA': {
    signer  : new EdDsaAlgorithm(),
    options : { name: 'EdDSA' }
  }
}

type SignerValue<T extends Web5Crypto.Algorithm> = {
  signer: CryptoAlgorithm,
  options?: T
}