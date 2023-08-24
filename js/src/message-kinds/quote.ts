import { QuoteModel, MessageKind } from '../types.js'

export class Quote {
  /** a set of valid Message kinds that can come after an rfq */
  readonly validNext = new Set<MessageKind>(['order', 'close'])
  readonly kind: MessageKind = 'quote'

  private data: QuoteModel

  constructor(quoteData: QuoteModel) {
    this.data = quoteData
  }

  toJSON() {
    return this.data
  }
}