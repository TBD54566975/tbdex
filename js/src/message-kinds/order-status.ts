import { OrderStatusModel, MessageKind } from '../types.js'

/**
 * Sent by the PFI to Alice to convey the current status of an order. There can be many OrderStatus
 * messages in a given Exchange
 */
export class OrderStatus {
  /** a set of valid Message kinds that can come after an orderStatus */
  readonly validNext = new Set<MessageKind>([])
  readonly kind: MessageKind = 'orderStatus'

  private data: OrderStatusModel

  constructor(orderStatusData: OrderStatusModel) {
    this.data = orderStatusData
  }

  /** Current status of Order that's being executed (e.g. PROCESSING, COMPLETED, FAILED etc.) */
  get orderStatus() {
    return this.data.orderStatus
  }

  toJSON() {
    return this.data
  }
}