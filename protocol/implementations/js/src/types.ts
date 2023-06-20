export type TbDEXMessage = Metadata &
  (
    | {
        type: "offering"
        body: Offering
      }
    | {
        type: "rfq"
        body: Rfq
      }
    | {
        type: "quote",
        body: Quote
      }
    | {
        type: "order"
        body: Order
      }
    | {
        type: "orderStatus"
        body: OrderStatus
      }
  )

export interface Metadata {
  id: string
  contextId: string
  from: string
  to: string
  createdTime: string
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
  kind: "DEBIT_CARD" | "BITCOIN_ADDRESS"
  fee?: {
    [k: string]: unknown
  }
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
  orderStatus: "PENDING" | "COMPLETED" | "FAILED"
}
