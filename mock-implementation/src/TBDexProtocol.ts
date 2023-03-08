export interface RequestForQuoteMessage {
    id: string;
    have: string;
    want: string;
    side: "have" | "want";
    size: number;
    paymentTypes?: Record<string, unknown>;
  }
  
  export interface QuoteMessage {
    quoteId: string;
    requestForQuoteId: string;
    offerUnit: string;
    offerSize: number;
    costUnit: string;
    costSize: number;
    paymentType: Record<string, unknown>;
    presentationDefinitionRequest: Record<string, unknown>;
  }
  
  export interface AcceptMessage {
    credentialsSubmission: Record<string, unknown>;
    acceptedQuoteId: string;
    deliveryInstructions: Record<string, unknown>;
  }
  
  export interface PaymentRequestMessage {
    paymentInstructions: Record<string, unknown>;
  }
  
  export interface PaymentReceiptMessage {
    verifiableCredentialJwt: string;
  }
  
  export interface CloseMessage {
    reason?: string;
  }
  
  export interface TBDexMessage {
    id: string;
    contextId: string;
    from: string;
    to: string;
    type: "RequestForQuote" | "Quote" | "Accept" | "PaymentRequest" | "PaymentReceipt" | "Close";
    body: RequestForQuoteMessage | QuoteMessage | AcceptMessage | PaymentRequestMessage | PaymentReceiptMessage | CloseMessage;
    createdTime: number;
    expiresTime?: number;
  }
  