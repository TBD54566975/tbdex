import { RfqModel, MessageKind } from '../types.js'

export class Rfq {
  /** a set of valid Message kinds that can come after an rfq */
  readonly validNext = new Set<MessageKind>(['quote', 'close'])
  readonly kind: MessageKind = 'rfq'

  private data: RfqModel

  constructor(rfq: RfqModel) {
    //! TODO: validate beforehand?
    this.data = rfq
  }

  /** Offering which Alice would like to get a quote for */
  get offeringId() {
    return this.data.offeringId
  }

  /** Amount of quote currency you want to spend in order to receive base currency */
  get quoteAmountSubunits() {
    return this.data.quoteAmountSubunits
  }

  /** Presentation Submission VP that fulfills the requirements included in the respective Offering */
  get vcs() {
    return this.data.vcs
  }

  /** Selected payment method that Alice will use to send the listed quote currency to the PFI. */
  get payinMethod() {
    return this.data.payinMethod
  }

  /** Selected payment method that the PFI will use to send the listed base currency to Alice */
  get payoutMethod() {
    return this.data.payoutMethod
  }

  toJSON() {
    return this.data
  }
}