import type { DataResponse, ErrorDetail, ErrorResponse, HttpResponse } from './types.js'
import type { ResourceMetadata, MessageModel, OfferingModel, ResourceModel } from '../types.js'
import type { MessageKindClass } from '../message.js'

import queryString from 'query-string'

import { utils as didUtils } from '@web5/dids'
import { resolveDid } from '../did-resolver.js'
import { Offering } from '../resource-kinds/index.js'
import { Resource } from '../resource.js'
import { Message } from '../message.js'
import { PrivateKeyJwk } from '@web5/crypto'

/**
 * options passed to {@link PfiRestClient.sendMessage} method
 */
export type SendMessageOptions<T extends MessageKindClass> = {
  /** the message you want to send */
  message: Message<T> | MessageModel<T['kind']>
}

/**
 * options passed to {@link PfiRestClient.getOfferings} method
 */
export type GetOfferingsOptions = {
  /** the DID of the PFI from whom you want to get offerings */
  pfiDid: string
  params?: {
    /** ISO 3166 currency code string */
    baseCurrency: OfferingModel['baseCurrency']['currencyCode']
    /** ISO 3166 currency code string */
    quoteCurrency: OfferingModel['baseCurrency']['currencyCode']
    id: ResourceMetadata<any>['id']
  }
}

/**
 * options passed to {@link PfiRestClient.getExchange} method
 */
export type GetExchangeOptions = {
  /** the DID of the PFI from whom you want to get offerings */
  pfiDid: string
  /** the exchange you want to fetch */
  exchangeId: string
  privateKeyJwk: PrivateKeyJwk
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

export class PfiRestClient {
  /**
   * sends the message provided to the intended recipient
   * @param opts - options
   * @throws if message verification fails
   * @throws if recipient DID resolution fails
   * @throws if recipient DID does not have a PFI service entry
   */
  static async sendMessage<T extends MessageKindClass>(opts: SendMessageOptions<T>): Promise<HttpResponse | ErrorResponse> {
    const { message } = opts
    const jsonMessage: MessageModel<T['kind']> = message instanceof Message ? message.toJSON() : message

    await Message.verify(jsonMessage)

    const { to: pfiDid, exchangeId, kind } = jsonMessage.metadata
    const pfiServiceEndpoint = await PfiRestClient.getPfiServiceEndpoint(pfiDid)
    const apiRoute = `${pfiServiceEndpoint}/exchanges/${exchangeId}/${kind}`

    let response: Response
    try {
      response = await fetch(apiRoute, {
        method : 'POST',
        body   : JSON.stringify(jsonMessage)
      })
    } catch(e) {
      throw new Error(`Failed to send message to ${pfiDid}. Error: ${e.message}`)
    }

    const { status, headers } = response
    if (status === 202) {
      return { status, headers }
    } else {
      // TODO: figure out what happens if this fails. do we need to try/catch?
      const responseBody: { errors: ErrorDetail[] } = await response.json()
      return {
        status  : response.status,
        headers : response.headers,
        errors  : responseBody.errors
      }
    }
  }

  /**
   * gets offerings from the pfi provided
   * @param _opts - options
   */
  static async getOfferings(opts: GetOfferingsOptions): Promise<DataResponse<Resource<Offering>[]> | ErrorResponse> {
    const { pfiDid } = opts
    const pfiServiceEndpoint = await PfiRestClient.getPfiServiceEndpoint(opts.pfiDid)
    const queryParams = queryString.stringify(opts.params)
    const apiRoute = `${pfiServiceEndpoint}/offerings?${queryParams}`

    let response: Response
    try {
      response = await fetch(apiRoute)
    } catch(e) {
      throw new Error(`Failed to get offerings from ${pfiDid}. Error: ${e.message}`)
    }


    const data: Resource<Offering>[] = []

    if (response.status === 200) {
      const responseBody = await response.json() as { data: ResourceModel<'offering'>[] }
      for (let jsonResource of responseBody.data) {
        const resource = await Resource.parse(jsonResource)
        data.push(resource)
      }

      return {
        status  : response.status,
        headers : response.headers,
        data    : data
      }
    } else {
      return {
        status  : response.status,
        headers : response.headers,
        errors  : await response.json() as ErrorDetail[]
      } as ErrorResponse
    }
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
   * returns the PFI service entry from the DID Doc of the DID provided
   * @param did - the pfi's DID
   */
  static async getPfiServiceEndpoint(did: string) {
    const didDocument = await resolveDid(`${did}?service=pfi`)
    const [ didService ] = didUtils.getServices({ didDocument, type: 'PFI' })

    if (didService?.serviceEndpoint) {
      return didService.serviceEndpoint
    } else {
      throw new Error(`${did} has no PFI service entry`)
    }
  }
}