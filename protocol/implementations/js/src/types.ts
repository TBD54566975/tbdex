export type MessageType<M extends keyof MessageTypes> = MessageTypes[M]

export type TbDEXMessage<T extends keyof MessageTypes> = MessageMetadata & {
  type: T;
  body: MessageTypes[T];
}

export interface MessageMetadata {
  id: string
  threadId: string
  parentId: string
  from: string
  to: string
  createdTime: string
}

export type MessageTypes = {
  rfq: Rfq,
  quote: Quote,
  order: Order,
  orderStatus: OrderStatus
}

export interface Rfq {
  pair: string
  amount: string
  verifiablePresentationJwt: string
  payinInstrument: PaymentInstrument
  payoutInstrument: PaymentInstrument
}
export interface Quote {
  expiryTime: string
  totalFee: string
  amount: string
  paymentPresentationRequestJwt: string
  paymentInstructions: PaymentInstructions
}
export interface PaymentInstructions {
  payin?: PaymentInstruction
  payout?: PaymentInstruction
}
export interface PaymentInstruction {
  link?: string
  instruction?: string
}
export interface Order {
  paymentVerifiablePresentationJwt: string
}
export interface OrderStatus {
  orderStatus: Status
}

export enum Status {
  PENDING,
  COMPLETED,
  FAILED
}

export type ResourceType<R extends keyof ResourceTypes> = ResourceTypes[R];

export type ResourceTypes = {
  offering: Offering
}

export type TbDEXResource<R extends keyof ResourceTypes> = ResourceType<R>;

export interface Offering {
  id: string
  description: string
  pair: string
  unitPrice: string
  baseFee?: string
  min: string
  max: string
  presentationRequestJwt: string
  payinInstruments: PaymentInstrument[]
  payoutInstruments: PaymentInstrument[]
  createdTime: string
}

export interface PaymentInstrument {
  kind: PaymentInstrumentKind,
  fee?: {
    flatFee?: string
  }
}

export enum PaymentInstrumentKind {
  DEBIT_CARD,
  BITCOIN_ADDRESS
}