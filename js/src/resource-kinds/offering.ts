import { OfferingModel, ResourceKind } from '../types.js'

/**
 * An Offering is used by the PFI to describe a currency pair they have to offer
 * including the requirements, conditions, and constraints in
 * order to fulfill that offer.
 */
export class Offering {
  readonly data: OfferingModel
  readonly kind: ResourceKind = 'offering'

  constructor(offeringData: OfferingModel) {
    this.data = offeringData
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

  /** PresentationDefinition that describes the credential(s) the PFI requires in order to provide a quote. */
  get vcRequirements() {
    return this.data.vcRequirements
  }

  toJSON() {
    return this.data
  }
}