import type { PrivateKeyJwk, CryptoAlgorithm, Web5Crypto } from '@web5/crypto'
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
import { Convert } from '@web5/common'
import { EcdsaAlgorithm, EdDsaAlgorithm, Jose } from '@web5/crypto'

import { hash } from './crypto.js'
import { validate } from './validator.js'
import { Rfq, Quote, Order, OrderStatus, Close } from './message-kinds/index.js'

type MessageKindClass = Rfq | Quote | Order | OrderStatus | Close
type MetadataOptions = Omit<MessageMetadata, 'id' |'kind' | 'createdAt'>

type MessageOptions<T extends MessageKindClass> = {
  data: T
  metadata: T extends Rfq ? Omit<MetadataOptions, 'exchangeId'> : MetadataOptions
  private?: T extends Rfq ? Record<string, any> : never
}

type SignerValue<T extends Algorithm> = {
  signer: CryptoAlgorithm,
  options?: T
}

const signers: { [alg: string]: SignerValue<Web5Crypto.EcdsaOptions | Web5Crypto.EdDsaOptions> } = {
  'ES256K': {
    signer  : new EcdsaAlgorithm(),
    options : { name: 'secp256k1', hash: 'SHA-256' }
  },
  'EdDSA': {
    signer  : new EdDsaAlgorithm(),
    options : { name: 'EdDSA' }
  }
}

export class Message {
  private message: Partial<MessageModel>
  private _data: MessageKindClass

  constructor(jsonMessage: Partial<MessageModel>, data?: MessageKindClass) {
    this.message = jsonMessage

    // Message.validate(jsonMessage)

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
    // validate the message structure
    validate(jsonMessage, 'message')

    // TODO: decide whether validating the data property should go into the respective message kind classes
    // validate the value of `data`
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
   * @param privateKeyJwk - the key to sign with
   * @param kid - the kid to include in the jws header. used by the verifier to select the appropriate verificationMethod
   *              when resolving the sender's DID
   */
  async sign(privateKeyJwk: PrivateKeyJwk, kid: string): Promise<void> {
    const jwsHeader = { alg: privateKeyJwk.alg, kid }
    const jwsPayload = {
      metadata : hash(this.metadata),
      data     : hash(this.data.toJSON())
    }

    const base64UrlEncodedJwsHeader = Convert.object(jwsHeader).toBase64Url()
    const base64urlEncodedJwsPayload = Convert.object(jwsPayload).toBase64Url()

    const toSign = `${base64UrlEncodedJwsHeader}.${base64urlEncodedJwsPayload}`
    const toSignBytes = Convert.string(toSign).toUint8Array()

    const { signer, options } = signers[privateKeyJwk.alg]
    const key = await Jose.jwkToCryptoKey({ key: privateKeyJwk })

    const signatureBytes = await signer.sign({ key, data: toSignBytes, algorithm: options })
    const base64UrlEncodedSignature = Convert.uint8Array(signatureBytes).toBase64Url()

    this.message.signature = `${toSign}.${base64UrlEncodedSignature}`
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

  /** The metadata object contains fields about the message and is present in every tbdex message. */
  get metadata() {
    return this.message.metadata
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