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
  kind: PaymentMethodKind,
  paymentPresentationRequestJwt?: string
  fee?: {
    flatFee?: string
  }
}

export enum PaymentMethodKind {
  DEBIT_CARD,
  BITCOIN_ADDRESS,
  SQUARE_PAY
}

export type MessageType<M extends keyof MessageTypes> = MessageTypes[M]

export type MessageTypes = {
  rfq: Rfq,
  quote: Quote,
  orderStatus: OrderStatus
}

export interface MessageMetadata {
  id: string
  threadId: string
  parentId: string
  from: string
  to: string
  createdTime: string
}

export type TbDEXMessage<T extends keyof MessageTypes> = MessageMetadata & {
  type: T
  body: MessageTypes[T]
}

export interface Rfq {
  baseCurrency: string
  quoteCurrency: string
  amount: string
  kycProof: string
  payinMethod: PaymentMethodResponse
  payoutMethod: PaymentMethodResponse
}

export interface PaymentMethodResponse {
  kind: PaymentMethodKind,
  paymentVerifiablePresentationJwt?: string
}

export interface Quote {
  expiryTime: string
  totalFee: string
  amount: string
  paymentInstructions?: PaymentInstructions
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
