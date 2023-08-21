import type { TypeID } from 'typeid-js'

export type TbdexMessage<T extends keyof MessageTypes> = {
  metadata: Metadata<T>,
  data: MessageTypes[T],
  signature: string,
  private?: Object | null
}

export type MessageType<M extends keyof MessageTypes> = MessageTypes[M]

export type MessageTypes = {
  rfq: Rfq
  quote: Quote
  close: Close
  orderstatus: OrderStatus
}

export interface Metadata<T extends keyof MessageTypes> {
  from: string
  to: string
  kind: string,
  id: TypeID<T>
  threadId: TypeID<"rfq">
  parentId?: string | null
  createdAt: string
}

export interface Rfq {
  offeringId: TypeID<'offering'>
  quoteAmountSubunits: string
  vcsHash: string
  payinMethod: SelectedPaymentMethod
  payoutMethod: SelectedPaymentMethod
}

export interface Quote {
  expiresAt: string
  base: QuoteDetails
  quote: QuoteDetails
  paymentInstructions?: PaymentInstructions
}

export interface Order { }

export interface Close {
  reason?: string
}

export interface OrderStatus {
  orderStatus: Status
}

export interface SelectedPaymentMethod {
  kind: string
  paymentDetailsHash: string
}

export interface PaymentInstructions {
  payin?: PaymentInstruction
  payout?: PaymentInstruction
}

export interface PaymentInstruction {
  link?: string
  instruction?: string
}

export interface QuoteDetails {
  currencyCode: string
  amountSubunits: string
  feeSubunits?: string
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