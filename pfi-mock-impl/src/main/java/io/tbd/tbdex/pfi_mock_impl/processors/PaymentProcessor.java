package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.common.base.Preconditions;
import io.tbd.tbdex.pfi_mock_impl.circle.pojos.Source;
import io.tbd.tbdex.protocol.core.MessageThread;
import io.tbd.tbdex.protocol.messages.Ask;
import java.util.UUID;

public class PaymentProcessor {
  // This is the test wallet ID for Circle. Hard coded for now.
  // Funds can not be moved directly to an external address so this will be a middle ground.
  // TODO: find more elegant solution
//  private static final Source WALLET_SOURCE = new Source("1000594591", "wallet");
//
//  public void process(PaymentProcessorRequest request) {
//    // Get ASK from thread store
//    // TODO: change to get conditional offer and also add source and target amounts in offer
//    HibernateMessageThreadStore threadStore = new HibernateMessageThreadStore();
//    MessageThread messageThread = threadStore.getThread(request.thread_token);
//    Ask ask = messageThread.getAsk();
//    Preconditions.checkNotNull(ask);
//
//    // Register Bank Account with Circle.
//    // TODO: Do not store bank account in our database
//    BankAccount bankAccount = createBankAccount(request);
//    System.out.println(bankAccount);
//
//    Amount amount = new Amount.Builder()
//        .amount(ask.sourceAmount.toString())
//        .currency(CurrencyCode.valueOf(ask.sourceCurrency))
//        .build();
//
//    // On-Ramp
//    if (CurrencyCode.valueOf(ask.targetCurrency) == CurrencyCode.USDC) {
//      CreateWirePaymentRequest createWirePaymentRequest = new CreateWirePaymentRequest.Builder()
//          .amount(amount)
//          .trackingRef(bankAccount.trackingRef)
//          .build();
//
//      TransferRequest transferRequest = new TransferRequest.Builder()
//          .source(WALLET_SOURCE)
//          .destination(new Destination.Builder()
//              .type("blockchain")
//              .address(request.wallet_address)
//              .chain("ETH")
//              .build())
//          .idempotencyKey(UUID.randomUUID().toString())
//          .amount(amount)
//          .build();
//      try {
//        // Create a WIRE payment Request.
//        circleClient.createWirePayment(createWirePaymentRequest);
//        // Transfer USDC to external wallet address.
//        circleClient.transfer(transferRequest);
//      } catch (Exception e) {
//        System.out.println("wire payment failed");
//      }
//    // Off-Ramp
//    } else if (CurrencyCode.valueOf(ask.targetCurrency) == CurrencyCode.USD) {
//      try {
//        PayoutRequest payoutRequest = new PayoutRequest.Builder()
//            .source(WALLET_SOURCE)
//            .destination(new Destination.Builder()
//                .type("wire")
//                .id(bankAccount.id)
//                .build())
//            .idempotencyKey(UUID.randomUUID().toString())
//            .metadata(new Metadata.Builder()
//                .beneficiaryEmail(request.email_address)
//                .build())
//            .amount(amount)
//            .build();
//
//        circleClient.payout(payoutRequest);
//      } catch (Exception e) {
//        System.out.println("payout failed");
//      }
//    }
//  }
//
//  private BankAccount createBankAccount(PaymentProcessorRequest request) {
//    CreateBankAccountRequest createBankAccountRequest = new CreateBankAccountRequest.Builder()
//        .accountNumber(request.account_number)
//        .routingNumber(request.routing_number)
//        .idempotencyKey(request.idempotency_key)
//        .billingDetails(request.billing_details)
//        .bankAddress(request.bank_address)
//        .build();
//
//    BankAccount bankAccount;
//    try {
//      bankAccount = circleClient.createBankAccount(createBankAccountRequest);
//    } catch (Exception e) {
//      // TODO: add more error handling here
//      bankAccount = null;
//    }
//    return bankAccount;
//  }
}
