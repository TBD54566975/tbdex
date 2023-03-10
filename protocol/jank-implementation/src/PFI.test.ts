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
          },
        createdTime: Date.now(),
      };
    let bid = makeBid(msg);    
    console.log(bid);
    console.log(bid[1].presentationDefinitionRequest);
    

  });
});