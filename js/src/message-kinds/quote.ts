import { QuoteModel, MessageKind } from '../types.js'

/**
 * Sent by the PFI in response to an RFQ. Includes a locked-in price that the PFI is willing to honor until
 * the quote expires
 */
export class Quote {
  /** a set of valid Message kinds that can come after a quote */
  readonly validNext = new Set<MessageKind>(['order', 'close'])
  readonly kind: MessageKind = 'quote'

  readonly data: QuoteModel

  constructor(quoteData: QuoteModel) {
    this.data = quoteData
  }

  /** When this quote expires. Expressed as ISO8601 */
  get expiresAt() {
    return this.data.expiresAt
  }

  /** the amount of base currency that Alice will receive */
  get base() {
    return this.data.base
  }

  /** the amount of quote currency that the PFI will receive */
  get quote() {
    return this.data.base
  }

  /** Object that describes how to pay the PFI, and how to get paid by the PFI (e.g. BTC address, payment link) */
  get paymentInstructions() {
    return this.data.paymentInstructions
  }

  toJSON() {
    return this.data
  }
}