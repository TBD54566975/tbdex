import type { PresentationDefinitionV2 } from '@sphereon/pex-models'
import type { Schema as JsonSchema } from 'ajv'

export type { PresentationDefinitionV2, JsonSchema }


export type ResourceType<R extends keyof ResourceTypes> = ResourceTypes[R]

export type ResourceTypes = {
  offering: Offering
}

export type TbDEXResource<R extends keyof ResourceTypes> = ResourceType<R>

export type CurrencyDetails = {
  currencyCode: string
  minSubunit?: string
  maxSubunit?: string
}

export type Offering = {
  id: string
  description: string
  quoteUnitsPerBaseUnit: string
  baseCurrency: CurrencyDetails
  quoteCurrency: CurrencyDetails
  kycRequirements: PresentationDefinitionV2
  payinMethods: PaymentMethod[]
  payoutMethods: PaymentMethod[]
  createdTime: string
}
export interface PaymentMethod {
  kind: string
  requiredPaymentDetails?: JsonSchema
  feeSubunits?: string
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
  quoteAmountSubunits: string
  kycProof: string
  payinMethod: PaymentMethodResponse
  payoutMethod: PaymentMethodResponse
}

export interface PaymentMethodResponse {
  kind: string
  paymentDetails?: {
    [key: string]: any
  }
}

export interface Quote {
  expiryTime: string
  base: {
    currencyCode: string
    amountSubunits: string
    feeSubunits?: string
  }
  quote: {
    currencyCode: string
    amountSubunits: string
    feeSubunits?: string
  }
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
