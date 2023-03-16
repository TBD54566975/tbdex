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
    paymentType: string;
    presentationDefinitionRequest?: {type: "verifiablePresentation" | "verifiableCredential", specification: string};
  }
  
  export interface Accept {
    credentialsSubmission: {type: "verifiablePresentation" | "verifiableCredential", submission: string};
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
  

  /*
   * To be implemented by PFIs. 
   */
  export interface PFI {
    makeBid(message: TBDexMessage<RequestForQuote>): Quote[];
  }