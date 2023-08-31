import type { PrivateKeyJwk as Web5PrivateKeyJwk } from '@web5/crypto'
import type { ResourceModel, ResourceMetadata, OfferingModel } from './types.js'

import { typeid } from 'typeid-js'
import { Crypto } from './crypto.js'
import { validate } from './validator.js'
import { Offering } from './resource-kinds/index.js'

/** Union type of all Resource Classes exported from [resource-kinds](./resource-kinds/index.ts) */
export type ResourceKindClass = Offering

/**
 * options passed to {@link Resource.create} method
*/
export type CreateResourceOptions = {
  metadata: Omit<ResourceMetadata, 'id' |'kind' | 'createdAt' | 'updatedAt'>
  data: Offering
}

/** argument passed to {@link Resource} constructor */
export type NewResource = Omit<ResourceModel, 'signature'> & { signature?: string }

/**
 * tbDEX Resources are published by PFIs for anyone to consume and generally used as a part of the discovery process.
 * They are not part of the message exchange, i.e Alice cannot reply to a Resource.
 */
export class Resource {
  private _metadata: ResourceMetadata
  private _data: ResourceKindClass
  private _signature: string

  static create(options: CreateResourceOptions) {
    const metadata: ResourceMetadata = {
      ...options.metadata,
      id        : typeid(options.data.kind).toString(),
      kind      : options.data.kind,
      createdAt : new Date().toISOString()
    }

    const resource: NewResource = {
      metadata,
      data: options.data.toJSON()
    }

    return new Resource(resource, options.data)
  }

  /**
   * parses the json resource into a Resource instance. performs format validation and an integrity check on the signature
   * @param payload - the resource to parse. can either be an object or a string
   * @returns {Resource}
   */
  static async parse(payload: ResourceModel | string) {
    let jsonResource: ResourceModel
    try {
      jsonResource = typeof payload === 'string' ? JSON.parse(payload) : payload
    } catch(e) {
      throw new Error(`parse: Failed to parse resource. Error: ${e.message}`)
    }

    await Resource.verify(jsonResource)

    return new Resource(jsonResource)
  }

  /**
   * validates the resource and verifies the cryptographic signature
   * @throws if the message is invalid
   * @throws see {@link Crypto.verify}
   */
  static async verify(resource: Resource | ResourceModel) {
    let jsonResource: ResourceModel = resource instanceof Resource ? resource.toJSON() : resource
    Resource.validate(jsonResource)

    // create the payload to sign
    const toSign = { metadata: jsonResource.metadata, data: jsonResource.data }
    const hashedToSign = Crypto.hash(toSign)

    const signer = await Crypto.verify({ detachedPayload: hashedToSign, signature: jsonResource.signature })

    if (jsonResource.metadata.from !== signer) { // ensure that DID used to sign matches `from` property in metadata
      throw new Error('Signature verification failed: Expected DID in kid of JWS header must match metadata.from')
    }
  }

  /**
   * validates the resource provided against the appropriate json schemas.
   * 2-phased validation: First validates the resource structure and then
   * validates `data` based on the value of `metadata.kind`
   * @param jsonResource - the resource to validate
   *
   * @throws {Error} if validation fails
   */
  static validate(jsonResource: any): void {
    validate(jsonResource, 'resource')

    // TODO: decide whether validating the data property should go into the respective resource kind classes
    validate(jsonResource['data'], jsonResource['metadata']['kind'])
  }

  /**
   * Constructor is primarily for intended for internal use. For a better developer experience,
   * consumers should use {@link Resource.create} to programmatically create resources and
   * {@link Resource.parse} to parse stringified resources.
   * @param jsonResource - the resource as a json object
   * @param data - `resource.data` as a ResourceKind class instance. can be passed in as an optimization if class instance
   * is present in calling scope
   */
  constructor(jsonResource: NewResource, data?: ResourceKindClass) {
    this._metadata = jsonResource.metadata
    this._signature = jsonResource.signature // may be undefined

    if (data) {
      this._data = data
      return
    }

    switch(jsonResource.metadata.kind) {
      case 'offering':
        this._data = new Offering(jsonResource.data as OfferingModel)
        break
    }
  }

  /**
   * signs the message as a jws with detached content and sets the signature property
   * @param privateKeyJwk - the key to sign with
   * @param kid - the kid to include in the jws header. used by the verifier to select the appropriate verificationMethod
   *              when dereferencing the signer's DID
   */
  async sign(privateKeyJwk: Web5PrivateKeyJwk, kid: string): Promise<void> {
    const toSign = { metadata: this.metadata, data: this.data }
    const hashedToSign = Crypto.hash(toSign)

    this._signature = await Crypto.sign({ privateKeyJwk, kid, detatchedContent: hashedToSign })
  }

  /**
   * validates the resource and verifies the cryptographic signature
   * @throws if the resource is invalid
   * @throws see {@link Crypto.verify}
   */
  async verify() {
    return Resource.verify(this)
  }
  /**
   * returns the message as a json object. Automatically used by {@link JSON.stringify} method.
   */
  toJSON(): ResourceModel {
    return {
      metadata  : this.metadata,
      data      : this.data.toJSON(),
      signature : this.signature
    }
  }

  get metadata() {
    return this._metadata
  }

  get data() {
    return this._data
  }

  /** the resource's cryptographic signature */
  get signature() {
    return this._signature
  }

  /** the resource's id */
  get id() {
    return this.metadata.id
  }

  get kind() {
    return this.metadata.kind
  }

  get from() {
    return this.metadata.from
  }

  get createdAt() {
    return this.metadata.createdAt
  }

  get updatedAt() {
    return this.metadata.updatedAt
  }
}