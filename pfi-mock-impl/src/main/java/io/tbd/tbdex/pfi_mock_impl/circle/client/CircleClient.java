package io.tbd.tbdex.pfi_mock_impl.circle.client;

import com.squareup.protos.tbd.pfi.BankAccount;
import com.squareup.protos.tbd.pfi.CreateBankAccountRequest;
import com.squareup.protos.tbd.pfi.CreateWirePaymentRequest;
import com.squareup.protos.tbd.pfi.PayoutRequest;
import com.squareup.protos.tbd.pfi.TransferRequest;

public interface CircleClient {
  BankAccount createBankAccount(CreateBankAccountRequest createBankAccountRequest) throws Exception;

  void createWirePayment(CreateWirePaymentRequest createWirePaymentRequest) throws Exception;

  void transfer(TransferRequest transferRequest) throws Exception;

  void payout(PayoutRequest payoutRequest) throws Exception;
}
