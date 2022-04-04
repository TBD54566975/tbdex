package io.tbd.tbdex.pfi_mock_impl.circle.pojos;

public class TransferRequest {
  public Source source;
  public Destination destination;
  public Amount amount;
  public String idempotencyKey;
}
