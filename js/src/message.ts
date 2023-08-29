import type { PrivateKeyJwk as Web5PrivateKeyJwk } from '@web5/crypto'
import type {
  OrderStatusModel,
  MessageMetadata,
  MessageKind,
  MessageModel,
  OrderModel,
  CloseModel,
  QuoteModel,
  RfqModel,
  Private
} from './types.js'

import { typeid } from 'typeid-js'
import { Crypto } from './crypto.js'
import { validate } from './validator.js'
import { Rfq, Quote, Order, OrderStatus, Close } from './message-kinds/index.js'

/** Union type of all Resource Classes exported from [message-kinds](./message-kinds/index.ts) */
export type MessageKindClass = Rfq | Quote | Order | OrderStatus | Close

/**
 * options passed to {@link Message.create} method
 */
export type CreateMessageOptions<T extends MessageKindClass> = {
  data: T
  metadata: T extends Rfq ? Omit<MetadataOptions<T['kind']>, 'exchangeId'> : MetadataOptions<T['kind']>
  private?: T extends Rfq ? Record<string, any> : never
}

export type MetadataOptions<T extends MessageKind> = Omit<MessageMetadata<T>, 'id' |'kind' | 'createdAt'>

/** argument passed to {@link Message} constructor */
export type NewMessage<T extends MessageKind> = Omit<MessageModel<T>, 'signature'> & { signature?: string }

/**
 * Messages form exchanges between Alice and a PFI.
 */
export class Message<T extends MessageKindClass> {
  private _metadata: MessageMetadata<T['kind']>
  private _data: T['data']
  private _signature: string
  private _private?: T['kind'] extends 'rfq' ? Private : never

  /**
   * creates a Message using the options provided
   * @param options - creation options
   * @returns {Message}
   */
  static create<T extends MessageKindClass>(options: CreateMessageOptions<T>) {
    const metadata = {
      ...options.metadata,
      kind      : options.data.kind,
      id        : typeid(options.data.kind).toString(),
      createdAt : new Date().toISOString()
    } as MessageMetadata<T['kind']>

    if (options.data.kind === 'rfq') {
      metadata.exchangeId = metadata.id
    }

    const message = {
      metadata : metadata,
      data     : options.data.toJSON(),
    } as NewMessage<T['kind']>

    return new Message(message)
  }

  /**
   * parses the json message into a message instance. performs format validation and an integrity check on the signature
   * @param message - the message to parse. can either be an object or a string
   * @returns {Message}
   */
  static async parse<T extends MessageKind>(message: MessageModel<T> | string) {
    let jsonMessage: MessageModel<T>
    try {
      jsonMessage = typeof message === 'string' ? JSON.parse(message): message
    } catch(e) {
      throw new Error(`parse: Failed to parse message. Error: ${e.message}`)
    }

    await Message.verify(jsonMessage)

    return new Message(jsonMessage)
  }

  /**
   * validates the message and verifies the cryptographic signature
   * @throws if the message is invalid
   * @throws see {@link Crypto.verify}
   */
  static async verify<T extends MessageKindClass>(message: Message<T> | MessageModel<T['kind']>): Promise<void> {
    let jsonMessage: MessageModel<T['kind']> = message instanceof Message ? message.toJSON() : message

    Message.validate(jsonMessage)
    await Crypto.verify({ entity: jsonMessage })
  }

  /**
   * validates the message provided against the appropriate json schemas.
   * 2-phased validation: First validates the message structure and then
   * validates `data` based on the value of `metadata.kind`
   * @param jsonMessage - the message to validate
   *
   * @throws {Error} if validation fails
   */
  static validate(jsonMessage: any): void {
    // validate the message structure
    validate(jsonMessage, 'message')

    // validate the value of `data`
    validate(jsonMessage['data'], jsonMessage['metadata']['kind'])
  }

  /**
   * Constructor is primarily for intended for internal use. For a better developer experience,
   * consumers should use {@link Message.create} to programmatically create messages and
   * {@link Message.parse} to parse stringified messages
   * @param jsonMessage - the message as a json object
   * @returns {Message}
   */
  constructor(jsonMessage: NewMessage<T['kind']>) {
    this._metadata = jsonMessage.metadata

    if (jsonMessage.signature) {
      this._signature = jsonMessage.signature
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
   * signs the message as a jws with detached content and sets the signature property
   * @param privateKeyJwk - the key to sign with
   * @param kid - the kid to include in the jws header. used by the verifier to select the appropriate verificationMethod
   *              when dereferencing the signer's DID
   */
  async sign(privateKeyJwk: Web5PrivateKeyJwk, kid: string): Promise<void> {
    this._signature = await Crypto.sign({ entity: this.toJSON(), privateKeyJwk, kid })
  }

  /**
   * validates the message and verifies the cryptographic signature
   * @throws if the message is invalid
   * @throws see {@link Crypto.verify}
   */
  async verify() {
    return Message.verify(this)
  }

  /**
   * returns the message as a json object. Automatically used by {@link JSON.stringify} method.
   */
  toJSON() {
    const message = {
      metadata  : this.metadata,
      data      : this.data,
      signature : this.signature
    } as MessageModel<T['kind']>

    if (this._private) {
      message.private = this._private
    }

    return message
  }

  /** rfq type guard */
  isRfq(): this is Message<Rfq> {
    return this.metadata.kind === 'rfq'
  }

  /** quote type guard */
  isQuote(): this is Message<Quote> {
    return this.metadata.kind === 'quote'
  }

  /** order type guard */
  isOrder(): this is Message<Order> {
    return this.metadata.kind === 'order'
  }

  /** orderStatus type guard */
  isOrderStatus(): this is Message<OrderStatus> {
    return this.metadata.kind === 'orderStatus'
  }

  /** close type guard */
  isClose(): this is Message<Close> {
    return this.metadata.kind === 'close'
  }

  /** The metadata object contains fields about the message and is present in every tbdex message. */
  get metadata() {
    return this._metadata
  }

  /** the message kind's content */
  get data() {
    return this._data
  }

  /** the message's cryptographic signature */
  get signature() {
    return this._signature
  }

  /** the message id */
  get id() {
    return this.metadata.id
  }

  /** ID for an "exchange" of messages between Alice <-> PFI. Uses the id of the RFQ that initiated the exchange */
  get exchangeId() {
    return this.metadata.exchangeId
  }

  /** the message kind (e.g. rfq, quote) */
  get kind() {
    return this.metadata.kind
  }

  /** The sender's DID */
  get from() {
    return this.metadata.from
  }

  /** the recipient's DID */
  get to() {
    return this.metadata.to
  }

  /** Message creation time. Expressed as ISO8601 */
  get createdAt() {
    return this.metadata.createdAt
  }
}