import { TBDexMessage, RequestForQuote, Quote } from "./interfaces/tbdex-types";


export function selectBid(
    quotes: Quote[],
    identityTypes: string[],
    paymentTypes: string[]
  ): Quote | null {
    let bestDeal: Quote | null = null;
    let bestCost: number = Number.POSITIVE_INFINITY;
    for (const quote of quotes) {
      if (paymentTypes.includes(quote.paymentType)) {
        if (
          (identityTypes.length === 0 && !quote.presentationDefinitionRequest) ||
          (quote.presentationDefinitionRequest &&
            identityTypes.includes(
              quote.presentationDefinitionRequest.type
            ))
        ) {
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