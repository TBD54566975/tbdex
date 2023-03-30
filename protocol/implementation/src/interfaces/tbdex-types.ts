export type RequestForQuote = {
  id: string;
  have: string;
  want: string;
  side: "have" | "want";
  size: number;
  paymentTypes?: string[];
}

export type Quote = {
  quoteId: string;
  requestForQuoteId: string;
  offerUnit: string;
  offerSize: number;
  costUnit: string;
  costSize: number;
  paymentType: string;
  presentationDefinitionRequest?: {type: "verifiablePresentation" | "verifiableCredential", specification: string};
}

export type  Accept = {
  credentialsSubmission: {type: "verifiablePresentation" | "verifiableCredential", submission: string};
  acceptedQuoteId: string;
  deliveryInstructions: Record<string, unknown>;
}

export type PaymentRequest = {
  paymentInstructions: Record<string, unknown>;
}

export type PaymentReceipt = {
  verifiableCredentialJwt: string;
}

export interface Close {
  reason?: string;
}

export interface TBDexMessage<T = RequestForQuote | [Quote] | Accept | PaymentRequest | PaymentReceipt | Close> {
  id: string;
  contextId: string;
  from: string;
  to: string;
  type: "RequestForQuote" | "Quote" | "Accept" | "PaymentRequest" | "PaymentReceipt" | "Close";
  body: T, //RequestForQuote | [Quote] | Accept | PaymentRequest | PaymentReceipt | Close;
  createdTime: number;
  expiresTime?: number;
}


