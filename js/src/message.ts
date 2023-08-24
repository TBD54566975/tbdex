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
type MetadataOptions = Omit<MessageMetadata, 'id' |'kind' | 'createdAt'>

type MessageOptions<T extends MessageKindClass> = {
  data: T
  metadata: T extends Rfq ? Omit<MetadataOptions, 'exchangeId'> : MetadataOptions
  private?: T extends Rfq ? Record<string, any> : never
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

  /**
   * creates a Message instance using the options provided
   * @param options - creation options
   * @returns {Message}
   */
  static create<T extends MessageKindClass>(options: MessageOptions<T>) {
    const metadata: Partial<MessageMetadata> = {
      ...options.metadata,
      id        : typeid(options.data.kind).toString(),
      kind      : options.data.kind,
      createdAt : new Date().toISOString()
    }

    if (options.data.kind === 'rfq') {
      metadata.exchangeId = metadata.id
    }

    const message: Partial<MessageModel> = {
      metadata : metadata as MessageMetadata,
      data     : options.data.toJSON(),
    }

    return new Message(message, options.data)
  }

  /**
   * parses the json message into a message instance. performs validation and an integrity check
   * @param message - the message to parse. can either be an object or a string
   * @returns {Message}
   */
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

  /**
   * validates the message provided against the appropriate json schemas.
   * 2-phased validation: First validates the message structure and then
   * validates `data` based on the value of `metadata.kind`
   * @param jsonMessage - the message to validate
   */
  static validate(jsonMessage: any): void {
    validate(jsonMessage, 'message')

    // TODO: decide whether validating the data property should go into the respective message kind classes
    validate(jsonMessage['data'], jsonMessage['metadata']['kind'])
  }

  /**
   * verifies the cryptographic signature on the message
   */
  static verify(): void {
    // TODO: implement
  }

  /**
   * signs the message and sets the signature property
   */
  sign(): void {
    // TODO: implement
  }

  /** the message id */
  get id() {
    return this.message.metadata.id
  }

  /** ID for an "exchange" of messages between Alice <-> PFI. Uses the id of the RFQ that initiated the exchange */
  get exchangeId() {
    return this.message.metadata.exchangeId
  }

  /** the message kind (e.g. rfq, quote) */
  get kind() {
    return this.message.metadata.kind
  }

  /** The sender's DID */
  get from() {
    return this.message.metadata.from
  }

  /** the recipient's DID */
  get to() {
    return this.message.metadata.to
  }

  /** Message creation time. Expressed as ISO8601 */
  get createdAt() {
    return this.message.metadata.createdAt
  }

  /** the message kind's content */
  get data() {
    return this._data
  }

  /** the message's cryptographic signature */
  get signature() {
    return this.message.signature
  }

  toJSON() {
    return this.message
  }
}