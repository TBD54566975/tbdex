import { RequestForQuoteMessage } from "./TBDexProtocol";

describe("RequestForQuoteMessage", () => {
  const message: RequestForQuoteMessage = {
    id: "1234",
    have: "AUD",
    want: "Cheese",
    side: "have",
    size: 100,
  };

  it("should have the correct properties", () => {
    expect(message).toHaveProperty("id", "1234");
    expect(message).toHaveProperty("have", "AUD");
    expect(message).toHaveProperty("want", "Cheese");
    expect(message).toHaveProperty("side", "have");
    expect(message).toHaveProperty("size", 100);
  });
});
