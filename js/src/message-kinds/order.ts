import type { MessageKind, MessageMetadata } from '../types.js'
import { Message } from '../message.js'

/** options passed to {@link Order.create} */
export type CreateOrderOptions = {
  metadata: Omit<MessageMetadata<'order'>, 'id' |'kind' | 'createdAt'>
  private?: Record<string, any>
}

/** Message sent by Alice to the PFI to accept a Quote. */
export class Order extends Message<'order'> {
  readonly validNext = new Set<MessageKind>(['orderstatus'])

  static create(opts: CreateOrderOptions) {
    const metadata: MessageMetadata<'order'> = {
      ...opts.metadata,
      kind      : 'order',
      id        : Message.generateId('order'),
      createdAt : new Date().toISOString()
    }

    const message = { metadata, data: {} }
    return new Order(message)
  }
}