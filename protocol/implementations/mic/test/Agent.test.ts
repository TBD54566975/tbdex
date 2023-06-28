import { expect } from "chai";
import { Quote } from "../src/interfaces/tbdex-types";
import { selectBid } from "../src/Agent";

describe("selectBid", () => {
  const quotes: Quote[] = [
    {
      quoteId: 'p5xjfk1qa',
      requestForQuoteId: 'abcd',
      offerUnit: 'Cheese',
      offerSize: 1,
      costUnit: 'AUD',
      costSize: 2,
      paymentType: 'creditCard'
    },
    {
      quoteId: 'icv1f7mme',
      requestForQuoteId: 'abcd',
      offerUnit: 'Cheese',
      offerSize: 1,
      costUnit: 'AUD',
      costSize: 1,
      paymentType: 'creditCard',
      presentationDefinitionRequest: { type: 'verifiableCredential', specification: 'driversLicense' }
    }
  ];

  it("should return the best quote based on identity and payment type", () => {
    const identityTypes = ["verifiableCredential"];
    const paymentTypes = ["creditCard"];
    const bestQuote = selectBid(quotes, identityTypes, paymentTypes);
    expect(bestQuote).to.deep.equal({
      quoteId: 'icv1f7mme',
      requestForQuoteId: 'abcd',
      offerUnit: 'Cheese',
      offerSize: 1,
      costUnit: 'AUD',
      costSize: 1,
      paymentType: 'creditCard',
      presentationDefinitionRequest: { type: 'verifiableCredential', specification: 'driversLicense' }
    });
  });

  it("should return the quote with no presentation definition request if identityTypes is empty", () => {
    const identityTypes: string[] = [];
    const paymentTypes = ["creditCard"];
    const bestQuote = selectBid(quotes, identityTypes, paymentTypes);
    expect(bestQuote).to.deep.equal({
      quoteId: 'p5xjfk1qa',
      requestForQuoteId: 'abcd',
      offerUnit: 'Cheese',
      offerSize: 1,
      costUnit: 'AUD',
      costSize: 2,
      paymentType: 'creditCard'
    });
  });

  it("should return null if no quotes match the identity and payment type criteria", () => {
    const identityTypes = ["verifiablePresentation"];
    const paymentTypes = ["debitCard"];
    const bestQuote = selectBid(quotes, identityTypes, paymentTypes);
    expect(bestQuote).to.be.null;
  });
});
