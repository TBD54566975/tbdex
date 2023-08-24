import { OrderStatusModel, MessageKind } from '../types.js'

export class OrderStatus {
  /** a set of valid Message kinds that can come after an orderStatus */
  readonly validNext = new Set<MessageKind>([])
  readonly kind: MessageKind = 'orderStatus'

  private data: OrderStatusModel

  constructor(orderStatusData: OrderStatusModel) {
    this.data = orderStatusData
  }

  toJSON() {
    return this.data
  }
}