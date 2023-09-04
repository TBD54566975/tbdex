import type { MessageKind, MessageMetadata } from '../types.js'
import { Message } from '../message.js'

/** options passed to {@link Order.create} */
export type CreateOrderOptions = {
  metadata: Omit<MessageMetadata<'order'>, 'id' |'kind' | 'createdAt'>
  private?: Record<string, any>
}

export class Order extends Message<'order'> {
  readonly validNext = new Set<MessageKind>(['orderstatus'])

  static create(opts: CreateOrderOptions) {
    const id = Message.generateId('order')
    const metadata: MessageMetadata<'order'> = {
      ...opts.metadata,
      kind       : 'order',
      id         : id,
      exchangeId : id,
      createdAt  : new Date().toISOString()
    }

    const message = { metadata, data: {} }
    return new Order(message)
  }
}