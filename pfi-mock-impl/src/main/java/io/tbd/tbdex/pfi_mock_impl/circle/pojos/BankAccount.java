package io.tbd.tbdex.pfi_mock_impl.circle.pojos;

public class BankAccount {
  public String id;
  public String trackingRef;

  public BankAccount(String id, String trackingRef) {
    this.id = id;
    this.trackingRef = trackingRef;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTrackingRef() {
    return trackingRef;
  }

  public void setTrackingRef(String trackingRef) {
    this.trackingRef = trackingRef;
  }
}
