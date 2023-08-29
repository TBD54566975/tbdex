import type { PrivateKeyJwk as Web5PrivateKeyJwk } from '@web5/crypto'
import type { ResourceModel, ResourceMetadata, ResourceKind, OfferingModel } from './types.js'

import { typeid } from 'typeid-js'
import { Crypto } from './crypto.js'
import { validate } from './validator.js'
import { Offering } from './resource-kinds/index.js'

/** Union type of all Resource Classes exported from [resource-kinds](./resource-kinds/index.ts) */
export type ResourceKindClass = Offering

/**
 * options passed to {@link Resource.create} method
*/
export type CreateResourceOptions<T extends ResourceKindClass> = {
  metadata: Omit<ResourceMetadata<T['kind']>, 'id' |'kind' | 'createdAt' | 'updatedAt'>
  data: T
}

/** argument passed to {@link Resource} constructor */
export type NewResource<T extends ResourceKind> = Omit<ResourceModel<T>, 'signature'> & { signature?: string }

/**
 * tbDEX Resources are published by PFIs for anyone to consume and generally used as a part of the discovery process.
 * They are not part of the message exchange, i.e Alice cannot reply to a Resource.
 */
export class Resource<T extends ResourceKindClass> {
  private _metadata: ResourceMetadata<T['kind']>
  private _data: T['data']
  private _signature: string

  static create<T extends ResourceKindClass>(options: CreateResourceOptions<T>) {
    const metadata = {
      ...options.metadata,
      id        : typeid(options.data.kind).toString(),
      kind      : options.data.kind,
      createdAt : new Date().toISOString()
    } as ResourceMetadata<T['kind']>

    const resource = {
      metadata,
      data: options.data.toJSON()
    } as NewResource<T['kind']>

    return new Resource(resource)
  }

  /**
   * parses the json resource into a Resource instance. performs format validation and an integrity check on the signature
   * @param payload - the resource to parse. can either be an object or a string
   * @returns {Resource}
   */
  static async parse<T extends ResourceKind>(payload: ResourceModel<T> | string) {
    let jsonResource: ResourceModel<T>
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
  static async verify<T extends ResourceKindClass>(resource: Resource<T> | ResourceModel<T['kind']>) {
    let jsonResource: ResourceModel<T['kind']> = resource instanceof Resource ? resource.toJSON() : resource

    Resource.validate(jsonResource)
    await Crypto.verify({ entity: jsonResource })
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
  constructor(jsonResource: NewResource<T['kind']>) {
    this._metadata = jsonResource.metadata
    this._signature = jsonResource.signature // may be undefined

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
    this._signature = await Crypto.sign({ entity: this.toJSON(), privateKeyJwk, kid })
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
  toJSON(): ResourceModel<T['kind']> {
    return {
      metadata  : this.metadata,
      data      : this.data,
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