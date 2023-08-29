import { OrderModel, MessageKind } from '../types.js'

export class Order {
  /** a set of valid Message kinds that can come after a close */
  readonly validNext = new Set<MessageKind>(['orderstatus'])
  readonly kind: MessageKind = 'order'

  private data: OrderModel

  constructor(closeData: OrderModel) {
    this.data = closeData
  }

  toJSON() {
    return this.data
  }
}