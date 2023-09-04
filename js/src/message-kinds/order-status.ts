import type { MessageKind, MessageKindModel, MessageMetadata } from '../types.js'
import { Message } from '../message.js'

/** options passed to {@link OrderStatus.create} */
export type CreateOrderStatusOptions = {
  data: MessageKindModel<'orderstatus'>
  metadata: Omit<MessageMetadata<'orderstatus'>, 'id' |'kind' | 'createdAt'>
}

/**
 * Sent by the PFI to Alice to convey the current status of an order. There can be many OrderStatus
 * messages in a given Exchange
 */
export class OrderStatus extends Message<'orderstatus'> {
  readonly validNext = new Set<MessageKind>([])

  static create(opts: CreateOrderStatusOptions) {
    const id = Message.generateId('orderstatus')
    const metadata: MessageMetadata<'orderstatus'> = {
      ...opts.metadata,
      kind       : 'orderstatus',
      id         : id,
      exchangeId : id,
      createdAt  : new Date().toISOString()
    }

    const message = { metadata, data: opts.data }
    return new OrderStatus(message)
  }

  /** Current status of Order that's being executed (e.g. PROCESSING, COMPLETED, FAILED etc.) */
  get orderStatus() {
    return this.data.orderStatus
  }
}