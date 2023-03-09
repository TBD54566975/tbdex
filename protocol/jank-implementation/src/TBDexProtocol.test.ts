import { RequestForQuoteMessage } from "./TBDexProtocol";
import { expect } from "chai";

describe("RequestForQuoteMessage", () => {
  const message: RequestForQuoteMessage = {
    id: "1234",
    have: "AUD",
    want: "Cheese",
    side: "have",
    size: 100,
  }; 

  it("should have the correct properties", () => {
    expect(message).to.have.property("id", "1234");
    expect(message).to.have.property("have", "AUD");
    expect(message).to.have.property("want", "Cheese");
    expect(message).to.have.property("side", "have");
    expect(message).to.have.property("size", 100);
  });
});