
import type { PortableDid } from '@web5/dids'

import { DidIonMethod, DidKeyMethod } from '@web5/dids'
import { Jose } from '@web5/crypto'
import { Convert } from '@web5/common'

import { Rfq } from './message-kinds/index.js'
import { Offering } from './resource-kinds/index.js'
import { Crypto } from './crypto.js'
import { OfferingData, RfqData } from './types.js'

export type DidMethodOptions = 'key' | 'ion'

/** options passed to {@link DevTools.createRfq} */
export type RfqOptions = {
  /**
   * {@link PortableDid} of the rfq sender. used to generate a random credential that fulfills the vcRequirements
   * of the offering returned by {@link DevTools.createOffering}
  */
  sender: PortableDid
}


/** options passed to {@link DevTools.createCredential} */
export type CreateCredentialOptions = Omit<CreateJwtOptions, 'payload'> & {
  /** the credential type (e.g. UniversityDegreeCredential) */
  type: string
  /** data to include in the credential */
  data: Record<string, any>
}

export type CreateJwtOptions = {
  /** the thing to sign */
  payload: any,
  /** the JWT's subject (e.g. Alice's DID) */
  subject: string
  /** the JWT's issuer */
  issuer: PortableDid
}

/**
 * Utility functions for testing purposes
 */
export class DevTools {
  /**
   * creates and returns a DID
   * @param didMethod - the type of DID to create. defaults to did:key
   */
  static async createDid(didMethod: DidMethodOptions = 'key') {
    if (didMethod === 'key') {
      return DidKeyMethod.create()
    } else if (didMethod === 'ion') {
      return DidIonMethod.create()
    } else {
      throw new Error(`${didMethod} method not implemented.`)
    }
  }

  /**
   * creates and returns an example offering. Useful for testing purposes
   */
  static createOffering() {
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

    return Offering.create({
      metadata : { from: 'did:ex:pfi' },
      data     : offeringData
    })
  }

  /**
   *
   * creates and returns an example rfq for the offering returned by {@link DevTools.createOffering}.
   * Useful for testing purposes.
   *
   * **NOTE**: generates a random credential that fulfills the offering's required claims
   */
  static async createRfq(opts: RfqOptions) {
    const { sender } = opts
    const { signedCredential } = await DevTools.createCredential({
      type    : 'YoloCredential',
      issuer  : sender,
      subject : sender.did,
      data    : {
        'beep': 'boop'
      }
    })

    const rfqData: RfqData = {
      offeringId  : 'abcd123',
      payinMethod : {
        kind           : 'DEBIT_CARD',
        paymentDetails : {
          'cardNumber'     : '1234567890123456',
          'expiryDate'     : '12/22',
          'cardHolderName' : 'Ephraim Bartholomew Winthrop',
          'cvv'            : '123'
        }
      },
      payoutMethod: {
        kind           : 'BTC_ADDRESS',
        paymentDetails : {
          btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        }
      },
      quoteAmountSubunits : '20000',
      claims              : [signedCredential]
    }

    return Rfq.create({
      metadata : { from: sender.did, to: 'did:ex:pfi' },
      data     : rfqData
    })
  }

  /**
   * creates a verifiable credential using the options provided. This method is intended for testing purposes
   * @param opts
   * @returns
   */
  static async createCredential(opts: CreateCredentialOptions) {
    const credential = {
      '@context'          : ['https://www.w3.org/2018/credentials/v1'],
      'id'                : Date.now().toString(),
      'type'              : opts.type,
      'issuer'            : opts.issuer.did,
      'issuanceDate'      : new Date().toISOString(),
      'credentialSubject' : { id: opts.subject, ...opts.data }
    }

    const signedCredential = await DevTools.createJwt({
      issuer  : opts.issuer,
      subject : credential.credentialSubject.id,
      payload : { vc: credential }
    })

    return { credential, signedCredential }
  }

  static async createJwt(opts: CreateJwtOptions) {
    const { issuer, subject, payload } = opts
    const { privateKeyJwk } = issuer.keySet.verificationMethodKeys[0]

    // build jwt header
    const namedCurve = privateKeyJwk['crv']
    const algorithmName = Crypto.crvToAlgMap[namedCurve]
    const jwtHeader = { alg: algorithmName, kid: privateKeyJwk.kid }
    const base64urlEncodedJwtHeader = Convert.object(jwtHeader).toBase64Url()

    // build jwt payload
    const jwtPayload = { iss: issuer.did, sub: subject, ...payload }
    const base64urlEncodedJwtPayload = Convert.object(jwtPayload).toBase64Url()

    // build what will be signed
    const toSign = `${base64urlEncodedJwtHeader}.${base64urlEncodedJwtPayload}`
    const bytesToSign = Convert.string(toSign).toUint8Array()

    // select signer based on the provided key's named curve
    const { signer, options } = Crypto.signers[namedCurve]
    const signingKey = await Jose.jwkToCryptoKey({ key: privateKeyJwk })

    // generate signature
    const signatureBytes = await signer.sign({ key: signingKey, data: bytesToSign, algorithm: options })
    const base64UrlEncodedSignature = Convert.uint8Array(signatureBytes).toBase64Url()

    return `${base64urlEncodedJwtHeader}.${base64urlEncodedJwtPayload}.${base64UrlEncodedSignature}`
  }

  /**
   * convenience method that can be used to decode a COMPACT JWT
   * @param compactJwt - the JWT to decode
   * @returns
   */
  static decodeJwt(compactJwt) {
    const [base64urlEncodedJwtHeader, base64urlEncodedJwtPayload, base64urlEncodedSignature] = compactJwt.split('.')

    return {
      header  : Convert.base64Url(base64urlEncodedJwtHeader).toObject(),
      payload : Convert.base64Url(base64urlEncodedJwtPayload).toObject(),
      base64urlEncodedSignature
    }
  }
}