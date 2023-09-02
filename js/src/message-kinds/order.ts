import { OrderModel, MessageKind } from '../types.js'

export class Order {
  /** a set of valid Message kinds that can come after an Order */
  readonly validNext = new Set<MessageKind>(['orderstatus'])
  readonly kind: MessageKind = 'order'

  readonly data: OrderModel

  constructor(orderData: OrderModel = {}) {
    this.data = orderData
  }

  toJSON() {
    return this.data
  }
}