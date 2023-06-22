export type MessageType<M extends keyof MessageTypes> = MessageTypes[M]

export type TbDEXMessage<T extends keyof MessageTypes> = Metadata & {
  type: T;
  body: MessageTypes[T];
}

export interface Metadata {
  id: string
  contextId: string
  from: string
  to: string
  createdTime: string
}

export type MessageTypes = {
  offering: Offering,
  rfq: Rfq,
  quote: Quote,
  order: Order,
  orderStatus: OrderStatus
}

export interface Offering {
  description: string
  pair: string
  unitPrice: string
  baseFee?: string
  min: string
  max: string
  presentationRequestJwt: string
  payinInstruments: PaymentInstrument[]
  payoutInstruments: PaymentInstrument[]
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