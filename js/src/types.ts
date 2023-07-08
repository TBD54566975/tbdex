import type { PresentationDefinitionV2 } from '@sphereon/pex-models'
import type { Schema as JsonSchema } from 'ajv'

export type { PresentationDefinitionV2, JsonSchema }


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
  kycRequirements: PresentationDefinitionV2
  payinMethods: PaymentMethod[]
  payoutMethods: PaymentMethod[]
  createdTime: string
}

export interface PaymentMethod {
  kind: string
  requiredPaymentDetails?: JsonSchema
  fee?: {
    flatFee?: string
  }
}

export type MessageType<M extends keyof MessageTypes> = MessageTypes[M]

export type MessageTypes = {
  rfq: Rfq
  quote: Quote
  close: Close
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
  kind: PaymentMethodKind
  paymentDetails?: {
    [key: string]: any
  }
}

export enum PaymentMethodKind {
  BTC_ADDRESS = 'BTC_ADDRESS',
  DEBIT_CARD = 'DEBIT_CARD',
  APPLE_PAY = 'APPLE_PAY',
  CASHAPP_PAY= 'CASHAPP_PAY'
}

export interface Quote {
  expiryTime: string
  totalFeeCents: string
  amountCents: string
  paymentInstructions?: PaymentInstructions
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
  CLOSED = 'CLOSED', // PFI or Customer-initiated closing
  PAYIN_INITIATED = 'PAYIN_INITIATED',
  PAYIN_FAILED = 'PAYIN_FAILED',
  PAYIN_COMPLETED = 'PAYIN_COMPLETED',
  PAYOUT_INITIATED = 'PAYOUT_INITIATED',
  PAYOUT_FAILED = 'PAYOUT_FAILED',
  PAYOUT_COMPLETED = 'PAYOUT_COMPLETED',
}

/**
 * Get the keys of T without any keys of U.
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

/**
 * Restrict using either only the keys of T or only the keys of U.
 */
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U
