export interface RequestForQuote {
    id: string;
    have: string;
    want: string;
    side: "have" | "want";
    size: number;
    paymentTypes?: string[];
  }
  
  export interface Quote {
    quoteId: string;
    requestForQuoteId: string;
    offerUnit: string;
    offerSize: number;
    costUnit: string;
    costSize: number;
    paymentType: {  type: string|null  };
    presentationDefinitionRequest: { credentials: { type: string } | null };
  }
  
  export interface Accept {
    credentialsSubmission: Record<string, unknown>;
    acceptedQuoteId: string;
    deliveryInstructions: Record<string, unknown>;
  }
  
  export interface PaymentRequest {
    paymentInstructions: Record<string, unknown>;
  }
  
  export interface PaymentReceipt {
    verifiableCredentialJwt: string;
  }
  
  export interface Close {
    reason?: string;
  }
  
  export interface TBDexMessage {
    id: string;
    contextId: string;
    from: string;
    to: string;
    type: "RequestForQuote" | "Quote" | "Accept" | "PaymentRequest" | "PaymentReceipt" | "Close";
    body: RequestForQuote | [Quote] | Accept | PaymentRequest | PaymentReceipt | Close;
    createdTime: number;
    expiresTime?: number;
  }
  