import type {
  PrivateKeyJwk as Web5PrivateKeyJwk,
  CryptoAlgorithm,
  Web5Crypto,
  JwsHeaderParams
} from '@web5/crypto'

import * as cbor from 'cborg'
import { sha256 } from '@noble/hashes/sha256'
import { Convert } from '@web5/common'
import { EcdsaAlgorithm, EdDsaAlgorithm, Jose } from '@web5/crypto'
import { deferenceDidUrl, isVerificationMethod } from './did-resolver.js'

/** options passed to {@link Crypto.sign} */
export type SignOptions = {
  detachedPayload?: string,
  payload?: object,
  privateKeyJwk: Web5PrivateKeyJwk,
  kid: string
}

/**
 * options passed to {@link Crypto.verify}
 */
export type VerifyOptions = {
  /** the message or resource to verify the signature of */
  detachedPayload?: string
  signature: string
}

/** used as value for each supported named curved listed in {@link Crypto.signers} */
type SignerValue<T extends Web5Crypto.Algorithm> = {
  signer: CryptoAlgorithm,
  options?: T
}

export class Crypto {
  /** supported cryptographic algorithms */
  static signers: { [alg: string]: SignerValue<Web5Crypto.EcdsaOptions | Web5Crypto.EdDsaOptions> } = {
    'secp256k1': {
      signer  : new EcdsaAlgorithm(),
      options : { name: 'ECDSA', hash: 'SHA-256' }
    },
    'Ed25519': {
      signer  : new EdDsaAlgorithm(),
      options : { name: 'EdDSA' }
    }
  }

  /** map of named curves to cryptographic algorithms. Necessary for JWS/JWK  */
  static crvToAlgMap = {
    'Ed25519'   : 'EdDSA',
    'secp256k1' : 'ES256K'
  }

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
   * signs the payload provided as a compact JWS
   * @param opts - signing options
   */
  static async sign(opts: SignOptions) {
    const { privateKeyJwk, kid, payload, detachedPayload } = opts

    // we can assume 'crv' exists in the JWK because its a required property for Elliptic Curve keys and we only
    // support Elliptic Curve keys atm. See: https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.1
    const namedCurve = privateKeyJwk['crv']
    // `alg`, short for algorithm name, is a required property in a JWS header
    const algorithmName = Crypto.crvToAlgMap[namedCurve]

    const jwsHeader: JwsHeader = { alg: algorithmName, kid }
    const base64UrlEncodedJwsHeader = Convert.object(jwsHeader).toBase64Url()

    let base64urlEncodedJwsPayload: string
    if (detachedPayload) {
      base64urlEncodedJwsPayload = detachedPayload
    } else {
      base64urlEncodedJwsPayload = Convert.object(payload).toBase64Url()
    }

    const { signer, options } = Crypto.signers[namedCurve]
    const key = await Jose.jwkToCryptoKey({ key: privateKeyJwk as Web5PrivateKeyJwk })

    const toSign = `${base64UrlEncodedJwsHeader}.${base64urlEncodedJwsPayload}`
    const toSignBytes = Convert.string(toSign).toUint8Array()

    const signatureBytes = await signer.sign({ key, data: toSignBytes, algorithm: options })
    const base64UrlEncodedSignature = Convert.uint8Array(signatureBytes).toBase64Url()

    if (detachedPayload) {
      // compact JWS with detached content: https://datatracker.ietf.org/doc/html/rfc7515#appendix-F
      return `${base64UrlEncodedJwsHeader}..${base64UrlEncodedSignature}`
    } else {
      return `${base64UrlEncodedJwsHeader}.${base64urlEncodedJwsPayload}.${base64UrlEncodedSignature}`
    }
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
  static async verify(opts: VerifyOptions): Promise<string> {
    const { signature, detachedPayload } = opts

    if (!signature) {
      throw new Error('Signature verification failed: Expected signature property to exist')
    }

    const splitJws = signature.split('.')
    if (splitJws.length !== 3) { // ensure that JWS has 3 parts
      throw new Error('Signature verification failed: Expected valid JWS with detached content')
    }

    let [base64UrlEncodedJwsHeader, base64urlEncodedJwsPayload, base64UrlEncodedSignature] = splitJws

    if (detachedPayload) {
      if (base64urlEncodedJwsPayload.length !== 0) { // ensure that JWS payload is empty
        throw new Error('Signature verification failed: Expected valid JWS with detached content')
      }

      base64urlEncodedJwsPayload = detachedPayload
    }

    const jwsHeader = Convert.base64Url(base64UrlEncodedJwsHeader).toObject() as JwsHeader
    if (!jwsHeader.alg || !jwsHeader.kid) { // ensure that JWS header has required properties
      throw new Error('Signature verification failed: Expected JWS header to contain alg and kid')
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

    const signedData = `${base64UrlEncodedJwsHeader}.${base64urlEncodedJwsPayload}`
    const signedDataBytes = Convert.string(signedData).toUint8Array()

    const signatureBytes = Convert.base64Url(base64UrlEncodedSignature).toUint8Array()

    // we can assume 'crv' exists in the JWK because its a required property for Elliptic Curve keys and we only
    // support Elliptic Curve keys atm. See: https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.1
    const namedCurve = publicKeyJwk['crv']
    const { signer, options } = Crypto.signers[namedCurve]

    // TODO: remove this monkeypatch once 'ext' is no longer a required property within a jwk passed to `jwkToCryptoKey`
    const monkeyPatchPublicKeyJwk = {
      ...publicKeyJwk,
      ext     : 'true' as const,
      key_ops : ['verify']
    }

    const key = await Jose.jwkToCryptoKey({ key: monkeyPatchPublicKeyJwk })
    const isLegit = await signer.verify({ algorithm: options, key, data: signedDataBytes, signature: signatureBytes })

    if (!isLegit) {
      throw new Error('Signature verification failed: Integrity mismatch')
    }

    const [did] = (jwsHeader as JwsHeaderParams).kid.split('#')
    return did
  }
}

// TODO: remove this monkey-patch after https://github.com/TBD54566975/web5-js/pull/175 is merged
type JwsHeader = Omit<JwsHeaderParams, 'alg'> & { alg: JwsHeaderParams['alg'] | 'EdDSA' }