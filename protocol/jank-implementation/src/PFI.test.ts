import { RequestForQuote, TBDexMessage } from "./TBDexProtocol";
import { expect } from "chai";
import { makeBid } from "./PFI";

describe("Fetch Quotes", () => {


    const rfq: RequestForQuote = {
        id: '1234',
        have: 'AUD',
        want: 'Cheese',
        side: 'have',
        size: 100,
      };
    
      const msg: TBDexMessage = {
        id: 'abcd',
        contextId: 'efgh',
        from: 'did:example:alice',
        to: 'did:example:pfi',
        type: 'RequestForQuote',
        body: rfq,
        createdTime: Date.now(),
      };


  it("should have the correct properties", () => {
    console.log(makeBid(msg));
    // check that there are 3 quotes
    const quotes = makeBid(msg);
    expect(quotes).to.have.lengthOf(3);
  });
});