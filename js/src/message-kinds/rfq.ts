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

  get offeringId() {
    return this.data.offeringId
  }

  get quoteAmountSubunits() {
    return this.data.quoteAmountSubunits
  }

  get payinMethod() {
    return this.data.payinMethod
  }

  get payoutMethod() {
    return this.data.payoutMethod
  }

  toJSON() {
    return this.data
  }
}