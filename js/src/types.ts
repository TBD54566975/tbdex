export type ResourceType<R extends keyof ResourceTypes> = ResourceTypes[R]

export type ResourceTypes = {
  offering: Offering
}

export type TbDEXResource<R extends keyof ResourceTypes> = ResourceType<R>

export interface Offering {
  id: string
  description: string
  baseCurrency: string
  quoteCurrency: string
  unitPrice: string
  baseFee?: string
  min: string
  max: string
  kycRequirements: string
  payinMethods: PaymentMethod[]
  payoutMethods: PaymentMethod[]
  createdTime: string
}

export interface PaymentMethod {
  kind: string
  paymentPresentationDefinitionJwt?: string
  fee?: {
    flatFee?: string
  }
}

export type MessageType<M extends keyof MessageTypes> = MessageTypes[M]

export type MessageTypes = {
  rfq: Rfq
  quoteResponse: QuoteResponse
  orderStatus: OrderStatus
}

export interface MessageMetadata {
  id: string
  threadId: string
  parentId?: string
  from: string
  to: string
  createdTime: string
}

export type TbDEXMessage<T extends keyof MessageTypes> = MessageMetadata & {
  type: T
  body: MessageTypes[T]
}

export interface Rfq {
  offeringId: string,
  amount: string
  kycProof: string
  payinMethod: PaymentMethodResponse
  payoutMethod: PaymentMethodResponse
}

export interface PaymentMethodResponse {
  kind: string
  paymentVerifiablePresentationJwt?: string
}

export type QuoteResponse = XOR<Quote, QuoteError>

export interface Quote {
  quote: {
    expiryTime: string
    totalFee: string
    amount: string
    paymentInstructions?: PaymentInstructions
  }
}

export interface QuoteError {
  error: {
    // add some sort of error enum too? i.e MALFORMED_RFQ, CIRCLE_ERROR, SQUARE_ERROR
    details: string
  }
}

export interface PaymentInstructions {
  payin?: PaymentInstruction
  payout?: PaymentInstruction
}
export interface PaymentInstruction {
  link?: string
  instruction?: string
}

export interface OrderStatus {
  orderStatus: Status
}

export enum Status {
  PENDING,
  COMPLETED,
  FAILED
}

/**
 * Get the keys of T without any keys of U.
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

/**
 * Restrict using either only the keys of T or only the keys of U.
 */
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U