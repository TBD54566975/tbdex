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
  unitPriceDollars: string
  baseFeeDollars?: string
  minDollars: string
  maxDollars: string
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
  quote: Quote
  close: Close
  order: Order
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
  offeringId: string
  amountCents: string
  kycProof: string
  payinMethod: PaymentMethodResponse
  payoutMethod: PaymentMethodResponse
}

export interface PaymentMethodResponse {
  kind: string
  paymentVerifiablePresentationJwt?: string
}

export interface Quote {
  expiryTime: string
  totalFeeCents: string
  amountCents: string
  paymentInstructions?: PaymentInstructions
}

export interface Order {
  empty: string
}

export interface Close {
  reason?: string
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
