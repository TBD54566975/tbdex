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

    let quotes = makeBid(msg);

    // I should get to quotes back. 
    // one for a larger amount of cheese, and one for a smaller amount of cheese - the larger one should ask for identity.
    expect(quotes).to.have.length(2);
    const noIdQuote = quotes[0];
    expect(noIdQuote).to.have.property("quoteId");
    expect(noIdQuote).to.have.property("offerSize", 50);
    expect(noIdQuote).to.have.property("costSize", 100);

    // larger offer as it asks for a drivers licence. But both cost the same
    let idQuote = quotes[1];    
    expect(idQuote).to.have.property("offerSize", 100);
    expect(idQuote).to.have.property("presentationDefinitionRequest");
    let presentationRequest = idQuote.presentationDefinitionRequest;
    expect(presentationRequest).to.have.property("type");
    expect(presentationRequest).to.have.property("type", "verifiableCredential");
    expect(presentationRequest).to.have.property("specification", "driversLicense");
    
    expect(idQuote).to.have.property("costSize", 100);

    

    

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
    
    expect(bid).to.have.length(2);
    let expensiveBid = bid[0];
    expect(expensiveBid).to.have.property("costSize", 2);

    let cheapBid = bid[1];
    expect(cheapBid).to.have.property("costSize", 1);





  });
});