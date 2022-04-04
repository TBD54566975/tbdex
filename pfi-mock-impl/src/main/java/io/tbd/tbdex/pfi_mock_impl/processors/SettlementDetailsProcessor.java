package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.common.base.Preconditions;
import io.tbd.tbdex.pfi_mock_impl.circle.CircleClient;
import io.tbd.tbdex.pfi_mock_impl.circle.pojos.Amount;
import io.tbd.tbdex.pfi_mock_impl.circle.pojos.BankAccount;
import io.tbd.tbdex.pfi_mock_impl.circle.pojos.CurrencyCode;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThread;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.messages.Ask;
import io.tbd.tbdex.protocol.processors.MessageProcessor;

public class SettlementDetailsProcessor implements MessageProcessor {
  MessageThreadStore store;
  CircleClient circleClient;

  SettlementDetailsProcessor(MessageThreadStore store, CircleClient circleClient) {
    this.store = store;
    this.circleClient = circleClient;
  }
  @Override
  public Message process(Message message) {
    MessageThread messageThread = this.store.getThread(message.threadID());

    Ask ask = messageThread.getAsk();
    Preconditions.checkNotNull(ask);

    BankAccount bankAccount = this.circleClient.createBankAccount(request);
    Amount amt = new Amount(ask.sourceAmount.toString(), CurrencyCode.valueOf(ask.sourceCurrency));

    if (amt.currency == CurrencyCode.USDC) {
      CreateWirePaymentRequest createWirePaymentRequest = new CreateWirePaymentRequest.Builder()
          .amount(amt)
          .trackingRef(bankAccount.trackingRef)
          .build();

      TransferRequest transferRequest = new TransferRequest.Builder()
          .source(WALLET_SOURCE)
          .destination(new Destination.Builder()
              .type("blockchain")
              .address(request.wallet_address)
              .chain("ETH")
              .build())
          .idempotencyKey(UUID.randomUUID().toString())
          .amount(amount)
          .build();
      try {
        // Create a WIRE payment Request.
        circleClient.createWirePayment(createWirePaymentRequest);
        // Transfer USDC to external wallet address.
        circleClient.transfer(transferRequest);
      } catch (Exception e) {
        System.out.println("wire payment failed");
      }
    // Off-Ramp
    } else if (amt.currency  == CurrencyCode.USD) {
      try {
        PayoutRequest payoutRequest = new PayoutRequest.Builder()
            .source(WALLET_SOURCE)
            .destination(new Destination.Builder()
                .type("wire")
                .id(bankAccount.id)
                .build())
            .idempotencyKey(UUID.randomUUID().toString())
            .metadata(new Metadata.Builder()
                .beneficiaryEmail(request.email_address)
                .build())
            .amount(amount)
            .build();

        circleClient.payout(payoutRequest);
      } catch (Exception e) {
        System.out.println("payout failed");
      }
    }
  }
}
