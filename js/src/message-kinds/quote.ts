import type { MessageKind, MessageKindModel, MessageMetadata } from '../types.js'
import { Message } from '../message.js'

/** options passed to {@link Quote.create} */
export type CreateQuoteOptions = {
  data: MessageKindModel<'quote'>
  metadata: Omit<MessageMetadata<'quote'>, 'id' |'kind' | 'createdAt'>
}

/**
 * Sent by the PFI in response to an RFQ. Includes a locked-in price that the PFI is willing to honor until
 * the quote expires
 */
export class Quote extends Message<'quote'> {
  readonly validNext = new Set<MessageKind>(['order', 'close'])

  static create(opts: CreateQuoteOptions) {
    const metadata: MessageMetadata<'quote'> = {
      ...opts.metadata,
      kind      : 'quote',
      id        : Message.generateId('quote'),
      createdAt : new Date().toISOString()
    }

    const message = { metadata, data: opts.data }
    return new Quote(message)
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
}