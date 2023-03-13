import { RequestForQuote, TBDexMessage } from "./TBDexProtocol";
import { expect } from "chai";
import { makeBid } from "./PFI";

describe("Fetch Quotes", () => {


  it("smoke test", () => {
    let msg: TBDexMessage = {
        id: 'abcd',
        contextId: 'efgh',
        from: 'did:example:alice',
        to: 'did:example:pfi',
        type: 'RequestForQuote',
        body: {
            id: '1234',
            have: 'AUD',
            want: 'Cheese',
            side: 'have',
            size: 100,
          },
        createdTime: Date.now(),
      };
    console.log(makeBid(msg));


    // I should get to quotes back. 
    // one for a larger amount of cheese, and one for a smaller amount of cheese - the larger one should ask for identity.

    

    

    msg = {
        id: 'abcd',
        contextId: 'efgh',
        from: 'did:example:alice',
        to: 'did:example:pfi',
        type: 'RequestForQuote',
        body: {
            id: '1234',
            have: 'AUD',
            want: 'Cheese',
            side: 'want',
            size: 1,
            paymentTypes: ['creditCard'],
          },
        createdTime: Date.now(),
      };
    let bid = makeBid(msg);    
    console.log(bid);
    console.log(bid[1].presentationDefinitionRequest);
    

  });
});