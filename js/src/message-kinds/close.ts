import { CloseModel, MessageKind } from '../types.js'

/**
 * a Close can be sent by Alice or the PFI as a reply to an RFQ or a Quote
 */
export class Close {
  /** a set of valid Message kinds that can come after a close */
  readonly validNext = new Set<MessageKind>([])
  readonly kind: MessageKind = 'close'

  readonly data: CloseModel

  constructor(closeData: CloseModel) {
    this.data = closeData
  }

  /** an explanation of why the exchange is being closed */
  get reason() {
    return this.data.reason
  }

  toJSON() {
    return this.data
  }
}