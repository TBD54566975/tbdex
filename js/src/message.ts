import type { MessageKind, MessageKindModel, MessageModel, MessageMetadata, NewMessage } from './types.js'
import type { Rfq, Quote, Order, OrderStatus, Close } from './message-kinds/index.js'
import type { PrivateKeyJwk as Web5PrivateKeyJwk } from '@web5/crypto'
import type { MessageKindClass } from './message-kinds/index.js'

import { validate } from './validator.js'
import { Crypto } from './crypto.js'
import { typeid } from 'typeid-js'

export class Message<T extends MessageKind> {
  private _metadata: MessageMetadata<T>
  private _data: MessageKindModel<T>
  private _signature: string

  /**
   * used by {@link Message.parse} to return an instance of message kind's class. This abstraction is needed
   * because importing the Message Kind classes (e.g. Rfq, Quote) creates a circular dependency
   * due to each concrete MessageKind class extending Message
  */
  static factory: <T extends MessageKind>(jsonMessage: MessageModel<T>) => MessageKindClass

  constructor(jsonMessage: NewMessage<T>) {
    this._metadata = jsonMessage.metadata
    this._data = jsonMessage.data
    this._signature = jsonMessage.signature
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

    return Message.factory(jsonMessage)
  }

  /**
   * validates the message and verifies the cryptographic signature
   * @throws if the message is invalid
   * @throws see {@link Crypto.verify}
   */
  static async verify<T extends MessageKind>(message: MessageModel<T> | Message<T>): Promise<string> {
    let jsonMessage: MessageModel<T> = message instanceof Message ? message.toJSON() : message

    Message.validate(jsonMessage)

    // create the payload to sign
    const toSign = { metadata: jsonMessage.metadata, data: jsonMessage.data }
    const hashedToSign = Crypto.hash(toSign)

    const signer = await Crypto.verify({ detachedPayload: hashedToSign, signature: jsonMessage.signature })

    if (jsonMessage.metadata.from !== signer) { // ensure that DID used to sign matches `from` property in metadata
      throw new Error('Signature verification failed: Expected DID in kid of JWS header must match metadata.from')
    }

    return signer
  }

  static generateId(messageKind: MessageKind) {
    return typeid(messageKind).toString()
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
   * signs the message as a jws with detached content and sets the signature property
   * @param privateKeyJwk - the key to sign with
   * @param kid - the verification method id to include in the jws header. used by the verifier to
   *               select the appropriate verificationMethod when dereferencing the signer's DID
   */
  async sign(privateKeyJwk: Web5PrivateKeyJwk, kid: string): Promise<void> {
    const toSign = { metadata: this.metadata, data: this.data }
    const hashedToSign = Crypto.hash(toSign)

    this._signature = await Crypto.sign({ privateKeyJwk, kid, detachedPayload: hashedToSign })
  }

  /**
   * validates the message and verifies the cryptographic signature
   * @throws if the message is invalid
   * @throws see {@link Crypto.verify}
   */
  async verify() {
    return Message.verify(this)
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

  /** Rfq type guard */
  isRfq(): this is Rfq {
    return this.metadata.kind === 'rfq'
  }

  /** Quote type guard */
  isQuote(): this is Quote {
    return this.metadata.kind === 'quote'
  }

  /** Order type guard */
  isOrder(): this is Order {
    return this.metadata.kind === 'order'
  }

  /** OrderStatus type guard */
  isOrderStatus(): this is OrderStatus {
    return this.metadata.kind === 'orderstatus'
  }

  /** Close type guard */
  isClose(): this is Close {
    return this.metadata.kind === 'close'
  }

  /**
   * returns the message as a json object. Automatically used by {@link JSON.stringify} method.
   */
  toJSON() {
    const message: MessageModel<T> = {
      metadata  : this.metadata,
      data      : this.data,
      signature : this.signature
    }

    return message
  }
}