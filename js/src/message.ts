import type {
  OrderStatusModel,
  MessageMetadata,
  MessageModel,
  OrderModel,
  CloseModel,
  QuoteModel,
  RfqModel
} from './types.js'

import { typeid } from 'typeid-js'

import { validate } from './validator.js'
import { Rfq, Quote, Order, OrderStatus, Close } from './message-kinds/index.js'

type MessageKindClass = Rfq | Quote | Order | OrderStatus | Close

type MessageOptions = {
  metadata: Omit<MessageMetadata, 'id' |'kind' | 'createdAt' | 'exchangeId'> & { exchangeId?: string }
  data: MessageKindClass
}


export class Message {
  private message: Partial<MessageModel>
  private _data: MessageKindClass

  constructor(jsonMessage: Partial<MessageModel>, data?: MessageKindClass) {
    Message.validate(jsonMessage)
    this.message = jsonMessage

    if (data) {
      this._data = data
      return
    }

    switch(jsonMessage.metadata.kind) {
      case 'rfq':
        this._data = new Rfq(jsonMessage.data as RfqModel)
        break
      case 'quote':
        this._data = new Quote(jsonMessage.data as QuoteModel)
        break
      case 'order':
        this._data = new Order(jsonMessage.data as OrderModel)
        break
      case 'orderStatus':
        this._data = new OrderStatus(jsonMessage.data as OrderStatusModel)
        break
      case 'close':
        this._data = new Close(jsonMessage.data as CloseModel)
        break
    }
  }

  static create(options: MessageOptions) {
    const metadata: Partial<MessageMetadata> = {
      ...options.metadata,
      id        : typeid(options.data.kind).toString(),
      kind      : options.data.kind,
      createdAt : new Date().toISOString()
    }

    if (!options.metadata.exchangeId && options.data.kind === 'rfq') {
      metadata.exchangeId = metadata.id
    } else {
      throw new Error('exchangeId is required')
    }

    const message: Partial<MessageModel> = {
      metadata : metadata as MessageMetadata,
      data     : options.data.toJSON(),
    }

    return new Message(message)
  }

  static parse(message: MessageModel | string) {
    let jsonMessage: MessageModel

    if (typeof message === 'string') {
      jsonMessage = JSON.parse(message)
    } else {
      jsonMessage = message
    }

    // TODO: verify message

    return new Message(jsonMessage)
  }

  static validate(jsonMessage: any): void {
    validate(jsonMessage, 'message')

    // TODO: decide whether validating the data property should go into the respective message kind classes
    validate(jsonMessage['data'], jsonMessage['metadata']['kind'])
  }

  static verify(): void {
    // TODO: implement
  }

  get id() {
    return this.message.metadata.id
  }

  get exchangeId() {
    return this.message.metadata.exchangeId
  }

  get kind() {
    return this.message.metadata.kind
  }

  get from() {
    return this.message.metadata.from
  }

  get to() {
    return this.message.metadata.to
  }

  get createdAt() {
    return this.message.metadata.createdAt
  }

  get data() {
    return this._data
  }

  toJSON() {
    return this.message
  }
}