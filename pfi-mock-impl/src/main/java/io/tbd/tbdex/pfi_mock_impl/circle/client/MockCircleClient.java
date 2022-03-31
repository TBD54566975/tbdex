package io.tbd.tbdex.pfi_mock_impl.circle.client;

import com.squareup.protos.tbd.pfi.BankAccount;
import com.squareup.protos.tbd.pfi.CreateBankAccountRequest;
import com.squareup.protos.tbd.pfi.CreateWirePaymentRequest;
import com.squareup.protos.tbd.pfi.PayoutRequest;
import com.squareup.protos.tbd.pfi.TransferRequest;

public class MockCircleClient implements CircleClient {
  @Override public BankAccount createBankAccount(CreateBankAccountRequest createBankAccountRequest)
      throws Exception {
    return new BankAccount.Builder()
        .id("")
        .trackingRef("")
        .build();
  }

  @Override public void createWirePayment(CreateWirePaymentRequest createWirePaymentRequest)
      throws Exception {

  }

  @Override public void transfer(TransferRequest transferRequest) throws Exception {

  }

  @Override public void payout(PayoutRequest payoutRequest) throws Exception {

  }
}
