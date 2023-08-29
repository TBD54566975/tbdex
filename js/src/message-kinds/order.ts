import { OrderModel, MessageKind } from '../types.js'

export class Order {
  /** a set of valid Message kinds that can come after a close */
  readonly validNext = new Set<MessageKind>(['orderStatus'])
  readonly kind: MessageKind = 'order'

  readonly data: OrderModel

  constructor(closeData: OrderModel) {
    this.data = closeData
  }

  toJSON() {
    return this.data
  }
}