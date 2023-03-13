import { TBDexMessage, RequestForQuote, Quote } from "./TBDexProtocol";


export function selectBid(
    quotes: Quote[],
    identities: string[],
    paymentTypes: string[]
  ): Quote | null {
    let bestDeal: Quote | null = null;
    let bestCost: number = Number.POSITIVE_INFINITY;
    for (const quote of quotes) {
      if (paymentTypes.includes(quote.paymentType.type)) { 
        const matchingIdentity = identities.find((id) => id === quote.presentationDefinitionRequest.credentials.type);
        if (matchingIdentity) {
          const cost = quote.costSize * quote.offerSize;
          if (cost < bestCost) {
            bestDeal = quote;
            bestCost = cost;
          }
        }
      }
    }
    return bestDeal;
  }