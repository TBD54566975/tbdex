import { TBDexMessage, RequestForQuote, Quote } from "./TBDexProtocol";


export function makeBid(msg: TBDexMessage): Quote[] {
  const { from } = msg;
  // Call a function to check the DID of the sender
  const senderDid = checkDid(from);

  // Extract the RFQ from the message body
  const rfq = msg.body as RequestForQuote;

  // Create some quotes with different payment types
  const quotes: Quote[] = [];

  // Quote 1: Payment via wire transfer
  const quote1: Quote = {
    quoteId: generateQuoteId(),
    requestForQuoteId: rfq.id,
    offerUnit: rfq.side === 'have' ? rfq.have : rfq.want,
    offerSize: rfq.size,
    costUnit: rfq.side === 'have' ? rfq.want : rfq.have,
    costSize: rfq.size * 1.05, // Add a 5% markup
    paymentType: {
      type: 'wire_transfer',
    },
    presentationDefinitionRequest: {},
  };
  quotes.push(quote1);

  // Quote 2: Payment via credit card
  const quote2: Quote = {
    quoteId: generateQuoteId(),
    requestForQuoteId: rfq.id,
    offerUnit: rfq.side === 'have' ? rfq.have : rfq.want,
    offerSize: rfq.size,
    costUnit: rfq.side === 'have' ? rfq.want : rfq.have,
    costSize: rfq.size * 1.1, // Add a 10% markup
    paymentType: {
      type: 'credit_card',
    },
    presentationDefinitionRequest: {},
  };
  quotes.push(quote2);

  // Quote 3: Payment via cryptocurrency
  const quote3: Quote = {
    quoteId: generateQuoteId(),
    requestForQuoteId: rfq.id,
    offerUnit: rfq.side === 'have' ? rfq.have : rfq.want,
    offerSize: rfq.size,
    costUnit: rfq.side === 'have' ? rfq.want : rfq.have,
    costSize: rfq.size * 0.95, // Apply a 5% discount
    paymentType: {
      type: 'crypto',
    },
    presentationDefinitionRequest: {},
  };
  quotes.push(quote3);

  return quotes;
}

function checkDid(from: string): string {
  // TODO: Implement checking of DID based on sender information
  return 'did:example:123';
}

function generateQuoteId(): string {
  // TODO: Implement generation of unique quote IDs
  return 'q123';
}
