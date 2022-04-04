package io.tbd.tbdex.pfi_mock_impl.circle.pojos;

public class Amount {
  public String amount;
  public CurrencyCode currency;

  public Amount(String amount, CurrencyCode currency) {
    this.amount = amount;
    this.currency = currency;
  }
}
