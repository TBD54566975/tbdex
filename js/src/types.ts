import type { Schema as JsonSchema } from 'ajv'
import type { PresentationDefinitionV2 } from '@sphereon/pex-models'

export { JsonSchema }

export type NewMessage<T extends MessageKind> = Omit<MessageModel<T>, 'signature'> & { signature?: string }
export type NewResource<T extends ResourceKind> = Omit<ResourceModel<T>, 'signature'> & { signature?: string }

export type ResourceModel<T extends ResourceKind> = {
  /** The metadata object contains fields about the resource and is present in every tbdex resources of all types. */
  metadata: ResourceMetadata<T>
  /** The actual resource content */
  data: ResourceKindModel<T>
  /** signature that verifies that authenticity and integrity of a message */
  signature: string
}

export type ResourceMetadata<T extends ResourceKind> = {
  /** The author's DID */
  from: string
  /** the resource kind (e.g. Offering) */
  kind: T
  /** the resource id */
  id: string
  /** When the resource was created at. Expressed as ISO8601 */
  createdAt: string
  /** When the resource was last updated. Expressed as ISO8601 */
  updatedAt?: string
}

export type ResourceKind = keyof ResourceKinds
export type ResourceKindModel<T extends ResourceKind> = ResourceKinds[T]
export type ResourceKinds = {
  'offering': OfferingData
}

/**
 * An Offering is used by the PFI to describe a currency pair they have to offer
 * including the requirements, conditions, and constraints in
 * order to fulfill that offer.
 */
export type OfferingData = {
  /** Brief description of what is being offered. */
  description: string
  /** Number of quote currency units for one base currency unit (i.e 290000 USD for 1 BTC) */
  quoteUnitsPerBaseUnit: string
  /** Details about the currency that the PFI is selling. */
  baseCurrency: CurrencyDetails
  /** Details about the currency that the PFI is buying in exchange for baseCurrency. */
  quoteCurrency: CurrencyDetails
  /** A list of accepted payment methods that Alice can use to send quoteCurrency to a PFI */
  payinMethods: PaymentMethod[]
  /** A list of accepted payment methods that Alice can use to receive baseCurrency from a PFI */
  payoutMethods: PaymentMethod[]
  /** Articulates the claim(s) required when submitting an RFQ for this offering. */
  requiredClaims: PresentationDefinitionV2
}

export type CurrencyDetails = {
  /** ISO 3166 currency code string */
  currencyCode: string
  /** Minimum amount of currency that can be requested */
  minSubunits?: string
  /** Maximum amount of currency that can be requested */
  maxSubunits?: string
}

export type PaymentMethod = {
  /** The type of payment method. e.g. BITCOIN_ADDRESS, DEBIT_CARD etc */
  kind: string
  /** A JSON Schema containing the fields that need to be collected in order to use this payment method */
  requiredPaymentDetails: JsonSchema
}

export type MessageModel<T extends MessageKind> = {
  /** The metadata object contains fields about the message and is present in every tbdex message. */
  metadata: MessageMetadata<T>
  /** The actual message content */
  data: MessageKindModel<T>
  /** signature that verifies that authenticity and integrity of a message */
  signature: string
}

export type MessageMetadata<T extends MessageKind> = {
  /** The sender's DID */
  from: string
  /** the recipient's DID */
  to: string
  /** the message kind (e.g. rfq, quote) */
  kind: T
  /** the message id */
  id: string
  /** ID for an "exchange" of messages between Alice <-> PFI. Uses the id of the RFQ that initiated the exchange */
  exchangeId: string
  /** Message creation time. Expressed as ISO8601 */
  createdAt: string
}

export type Private = Record<string, any>
export type MessageKindModel<T extends keyof MessageKinds> = MessageKinds[T]
export type MessageKind = 'rfq' | 'quote' | 'order' | 'orderstatus' | 'close'
export type MessageKinds = {
  'rfq': RfqData
  'quote': QuoteData
  'order': OrderData
  'orderstatus': OrderStatusData
  'close': CloseData
}

export type RfqData = {
  /** Offering which Alice would like to get a quote for */
  offeringId: string
  /** Amount of quote currency you want to spend in order to receive base currency */
  quoteAmountSubunits: string
  /** Selected payment method that Alice will use to send the listed quote currency to the PFI. */
  payinMethod: SelectedPaymentMethod
  /** Selected payment method that the PFI will use to send the listed base currency to Alice */
  payoutMethod: SelectedPaymentMethod
  /** claims that fulfill the requirements declared in an Offering */
  claims: string[]
}

export type SelectedPaymentMethod = {
  /** Type of payment method e.g. BTC_ADDRESS, DEBIT_CARD, MOMO_MPESA */
  kind: string
  /** An object containing the properties defined in the respective Offering's requiredPaymentDetails json schema */
  paymentDetails: Record<string, any> | string
}

/**
 * Message sent by the PFI in response to an RFQ. Includes a locked-in price that the PFI is willing to honor until
 * the quote expires
 */
export type QuoteData = {
  /** When this quote expires. Expressed as ISO8601 */
  expiresAt: string
  /** the amount of base currency that Alice will receive */
  base: QuoteDetails
  /** the amount of quote currency that the PFI will receive */
  quote: QuoteDetails
  /** Object that describes how to pay the PFI, and how to get paid by the PFI (e.g. BTC address, payment link) */
  paymentInstructions?: PaymentInstructions
}

export type QuoteDetails = {
  /** ISO 3166 currency code string */
  currencyCode: string
  /** The amount of currency expressed in the smallest respective unit */
  amountSubunits: string
  /** the amount paid in fees */
  feeSubunits?: string
}

export type PaymentInstructions = {
  /** link or instruction describing how to send quote currency to the PFI. */
  payin?: PaymentInstruction
  /** link or Instruction describing how to get recieve base currency from the PFI */
  payout?: PaymentInstruction
}

export type PaymentInstruction = {
  /** Link to allow Alice to pay PFI, or be paid by the PFI */
  link?: string
  /** Instruction on how Alice can pay PFI, or how Alice can be paid by the PFI */
  instruction?: string
}

/**
 * Message sent by Alice to the PFI to accept a Quote. Order is currently an empty object
 */
export type OrderData = {
  [key: string]: never
}

/**
 * Message sent by the PFI to Alice to convey the current status of an order. There can be many OrderStatus
 * messages in a given Exchange
 */
export type OrderStatusData = {
  /** Current status of Order that's being executed (e.g. PROCESSING, COMPLETED, FAILED etc.) */
  orderStatus: string
}

/**
 * a Close can be sent by Alice or the PFI as a reply to an RFQ or a Quote
 */
export type CloseData = {
  /** an explanation of why the exchange is being closed */
  reason?: string
}

