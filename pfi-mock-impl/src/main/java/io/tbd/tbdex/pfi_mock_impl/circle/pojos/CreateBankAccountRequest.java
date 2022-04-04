package io.tbd.tbdex.pfi_mock_impl.circle.pojos;

public class CreateBankAccountRequest {
  public String accountNumber;
  public String routingNumber;
  public String idempotencyKey;
  public BankAddress bankAddress;
  public BillingDetails billingDetails;

  public CreateBankAccountRequest(String accountNumber, String routingNumber, String idempotencyKey, BankAddress bankAddress, BillingDetails billingDetails) {
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
    this.idempotencyKey = idempotencyKey;
    this.bankAddress = bankAddress;
    this.billingDetails = billingDetails;
  }

  public String getAccountNumber() {
    return accountNumber;
  }

  public void setAccountNumber(String accountNumber) {
    this.accountNumber = accountNumber;
  }

  public String getRoutingNumber() {
    return routingNumber;
  }

  public void setRoutingNumber(String routingNumber) {
    this.routingNumber = routingNumber;
  }

  public String getIdempotencyKey() {
    return idempotencyKey;
  }

  public void setIdempotencyKey(String idempotencyKey) {
    this.idempotencyKey = idempotencyKey;
  }

  public BankAddress getBankAddress() {
    return bankAddress;
  }

  public void setBankAddress(BankAddress bankAddress) {
    this.bankAddress = bankAddress;
  }

  public BillingDetails getBillingDetails() {
    return billingDetails;
  }

  public void setBillingDetails(BillingDetails billingDetails) {
    this.billingDetails = billingDetails;
  }
}
