import type { ResourceKindModel, ResourceMetadata } from '../types.js'
import { Resource } from '../resource.js'

/** options passed to {@link Offering.create} */
export type CreateOfferingOptions = {
  data: ResourceKindModel<'offering'>
  metadata: Omit<ResourceMetadata<'offering'>, 'id' |'kind' | 'createdAt' | 'updatedAt'>
}

/**
 * An Offering is used by the PFI to describe a currency pair they have to offer
 * including the requirements, conditions, and constraints in
 * order to fulfill that offer.
 */
export class Offering extends Resource<'offering'> {
  static create(opts: CreateOfferingOptions) {
    const metadata: ResourceMetadata<'offering'> = {
      ...opts.metadata,
      kind      : 'offering',
      id        : Resource.generateId('offering'),
      createdAt : new Date().toISOString()
    }

    const message = { metadata, data: opts.data }
    return new Offering(message)
  }

  /** Brief description of what is being offered. */
  get description() {
    return this.data.description
  }

  /** Number of quote currency units for one base currency unit (i.e 290000 USD for 1 BTC) */
  get quoteUnitsPerBaseUnit() {
    return this.data.quoteUnitsPerBaseUnit
  }

  /** Details about the currency that the PFI is buying in exchange for baseCurrency. */
  get baseCurrency() {
    return this.data.baseCurrency
  }

  /** Details about the currency that the PFI is buying in exchange for baseCurrency. */
  get quoteCurrency() {
    return this.data.quoteCurrency
  }

  /** A list of accepted payment methods that Alice can use to send quoteCurrency to a PFI */
  get payinMethods() {
    return this.data.payinMethods
  }

  /** A list of accepted payment methods that Alice can use to receive baseCurrency from a PFI */
  get payoutMethods() {
    return this.data.payoutMethods
  }

  /** Articulates the claim(s) required when submitting an RFQ for this offering. */
  get requiredClaims() {
    return this.data.requiredClaims
  }
}