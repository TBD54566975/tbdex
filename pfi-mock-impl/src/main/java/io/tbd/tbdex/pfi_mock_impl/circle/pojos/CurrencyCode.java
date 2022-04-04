package io.tbd.tbdex.pfi_mock_impl.circle.pojos;

public enum CurrencyCode {
  USD("USD"),
  USDC("USDC");

  private final String code;

  CurrencyCode(String code) {
    this.code = code;
  }

  public String getCurrencyCode() {
    return this.code;
  }
}
