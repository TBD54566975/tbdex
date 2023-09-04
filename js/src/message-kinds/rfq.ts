import type { MessageKind, MessageKindModel, MessageMetadata } from '../types.js'
import { Message } from '../message.js'
import { Crypto } from '../crypto.js'

/** options passed to {@link Quote.create} */
export type CreateRfqOptions = {
  data: MessageKindModel<'rfq'>
  metadata: Omit<MessageMetadata<'rfq'>, 'id' |'kind' | 'createdAt' | 'exchangeId'>
  private?: Record<string, any>
}

export class Rfq extends Message<'rfq'> {
  /** a set of valid Message kinds that can come after an rfq */
  readonly validNext = new Set<MessageKind>(['quote', 'close'])
  _private: Record<string, any>

  static create(opts: CreateRfqOptions) {
    const id = Message.generateId('rfq')
    const metadata: MessageMetadata<'rfq'> = {
      ...opts.metadata,
      kind       : 'rfq',
      id         : id,
      exchangeId : id,
      createdAt  : new Date().toISOString()
    }

    // TODO: hash `data.payinMethod.paymentDetails` and set `private`
    // TODO: hash `data.payoutMethod.paymentDetails` and set `private`

    const message = { metadata, data: opts.data }
    return new Rfq(message)
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
    const jsonMessage = super.toJSON()
    jsonMessage['private'] = this._private

    return jsonMessage
  }
}