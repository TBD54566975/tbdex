import type { MessageKind, MessageKindModel, MessageMetadata } from '../types.js'
import { Message } from '../message.js'

/** options passed to {@link OrderStatus.create} */
export type CreateCloseOptions = {
  data: MessageKindModel<'close'>
  metadata: Omit<MessageMetadata<'close'>, 'id' |'kind' | 'createdAt'>
}

/** a Close can be sent by Alice or the PFI as a reply to an RFQ or a Quote */
export class Close extends Message<'close'> {
  /** a set of valid Message kinds that can come after a close */
  readonly validNext = new Set<MessageKind>([])

  static create(opts: CreateCloseOptions) {
    const id = Message.generateId('close')
    const metadata: MessageMetadata<'close'> = {
      ...opts.metadata,
      kind       : 'close',
      id         : id,
      exchangeId : id,
      createdAt  : new Date().toISOString()
    }

    const message = { metadata, data: opts.data }
    return new Close(message)
  }

  /** an explanation of why the exchange is being closed */
  get reason() {
    return this.data.reason
  }
}