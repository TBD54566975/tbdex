import type { ResourceModel, ResourceMetadata, OfferingModel } from './types.js'

import { typeid } from 'typeid-js'

import { validate } from './validator.js'
import { Offering } from './resource-kinds/index.js'

type ResourceOptions = {
  metadata: Omit<ResourceMetadata, 'id' |'kind' | 'createdAt'>
  data: Offering
}

export class Resource {
  private resource: Partial<ResourceModel>
  readonly data: Offering

  constructor(jsonResource: Partial<ResourceModel>) {
    Resource.validate(jsonResource)
    this.resource = jsonResource

    switch(jsonResource.metadata.kind) {
      case 'offering':
        this.data = new Offering(jsonResource.data as OfferingModel)
        break
    }
  }

  static create(options: ResourceOptions) {
    const resource: Partial<ResourceModel> = {
      metadata: {
        ...options.metadata,
        id        : typeid(options.data.kind).toString(),
        kind      : options.data.kind,
        createdAt : new Date().toISOString()
      },
      data: options.data.toJSON()
    }

    return new Resource(resource)
  }

  static parse(payload: ResourceModel | string) {
    let jsonResource: ResourceModel

    if (typeof payload === 'string') {
      jsonResource = JSON.parse(payload)
    } else {
      jsonResource = payload
    }

    return new Resource(jsonResource)
  }

  static validate(jsonMessage: any): void {
    validate(jsonMessage, 'resource')

    // TODO: decide whether validating the data property should go into the respective resource kind classes
    validate(jsonMessage['data'], jsonMessage['metadata']['kind'])
  }

  static verify(): void {
    // TODO: implement
  }

  get id() {
    return this.resource.metadata.id
  }

  get kind() {
    return this.resource.metadata.kind
  }

  get pfi() {
    return this.resource.metadata.pfi
  }

  get createdAt() {
    return this.resource.metadata.createdAt
  }

  get updatedAt() {
    return this.resource.metadata.updatedAt
  }

  toJSON() {
    return this.resource
  }
}