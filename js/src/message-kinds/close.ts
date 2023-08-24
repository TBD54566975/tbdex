import { CloseModel, MessageKind } from '../types.js'

export class Close {
  /** a set of valid Message kinds that can come after a close */
  readonly validNext = new Set<MessageKind>([])
  readonly kind: MessageKind = 'close'

  private data: CloseModel

  constructor(closeData: CloseModel) {
    this.data = closeData
  }

  toJSON() {
    return this.data
  }
}