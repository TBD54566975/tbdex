import type { MessageModel } from './types.js'
import type { PrivateKeyJwk as Web5PrivateKeyJwk } from '@web5/crypto'

import { Crypto } from './crypto.js'
import { Message } from './message.js'

/**
 * options passed to {@link PfiRestClient.sendMessage} method
 */
export type SendMessageOptions = {
  /** the message you want to send */
  message: Message | MessageModel
}

/**
 * options passed to {@link PfiRestClient.getOfferings} method
 */
export type GetOfferingsOptions = {
  /** the DID of the PFI from whom you want to get offerings */
  pfiDid: string
  // TODO: include supported query params
}

/**
 * options passed to {@link PfiRestClient.getExchange} method
 */
export type GetExchangeOptions = {
  /** the DID of the PFI from whom you want to get offerings */
  pfiDid: string
  /** the exchange you want to fetch */
  exchangeId: string
  // TODO: include privateKeyJwk needed to create authz token
  // TODO: include supported query params
}

/**
 * options passed to {@link PfiRestClient.getExchanges} method
 */
export type GetExchangesOptions = {
  /** the DID of the PFI from whom you want to get offerings */
  pfiDid: string
  // TODO: include privateKeyJwk needed to create authz token
  // TODO: include supported query params
}

export type BearerTokenModel = {
  timestamp: string
}

export class PfiRestClient {
  /**
   * sends the message provided to the intended recipient
   * @param _opts - options
   */
  static sendMessage(_opts: SendMessageOptions) {
    /**
     * TODO:
     * call Message.verify on provided message
     * resolve `metadata.to` DID
     * find pfi service endpoint in DID Doc
     * generate fully qualified URL for PFI RESTful API using serviceEndpoint + message.exchangeId + message.kind
     * send http request using fetch
     * handle response
     */
  }

  /**
   * gets offerings from the pfi provided
   * @param _opts - options
   */
  static getOfferings(_opts: GetOfferingsOptions) {
    /**
     * TODO:
     * resolve PFI DID
     * find pfi service endpoint in DID Doc
     * parse params provided in options into http query params
     * generate fully qualified URL for PFI RESTful API using serviceEndpoint + /offerings
     * send http request using fetch
     * handle response
     */
  }

  /**
   * get a specific exchange from the pfi provided
   * @param _opts - options
   */
  static getExchange(_opts: GetExchangeOptions) {
    /**
     * TODO:
     * resolve PFI DID
     * find pfi service endpoint in DID Doc
     * parse params provided in options into http query params
     * generate fully qualified URL for PFI RESTful API using serviceEndpoint + message.exchangeId
     * send http request using fetch
     * handle response
     */
  }

  /**
   * get a specific exchange from the pfi provided
   * @param _opts - options
   */
  static getExchanges(_opts: GetExchangesOptions) {
    /**
     * TODO:
     * resolve PFI DID
     * find pfi service endpoint in DID Doc
     * parse params provided in options into http query params
     * generate fully qualified URL for PFI RESTful API using serviceEndpoint + '/exchanges'
     * send http request using fetch
     * handle response
     */
  }

  /**
   * generates a jws to be used to authenticate GET requests
   * @param privateKeyJwk - the key to sign with
   * @param kid - the kid to include in the jws header. used by the verifier to select the appropriate verificationMethod
   *              when dereferencing the signer's DID
   */
  static async generateRequestToken(privateKeyJwk: Web5PrivateKeyJwk, kid: string): Promise<string> {
    const tokenPayload = { timestamp: new Date().toISOString() }
    return Crypto.sign({ privateKeyJwk, kid, payload: tokenPayload })
  }

  /**
   * validates the bearer token and verifies the cryptographic signature
   * @throws if the token is invalid
   * @throws see {@link Crypto.verify}
   */
  static async verify(requestToken: string): Promise<string> {
    return Crypto.verify({ signature: requestToken })
  }
}