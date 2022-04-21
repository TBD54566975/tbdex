package io.tbd.tbdex.pfi_mock_impl;

import com.squareup.protos.tbd.pfi.BankAddress;
import com.squareup.protos.tbd.pfi.BillingDetails;
import com.squareup.protos.tbd.pfi.PaymentInstrument;
import com.squareup.protos.tbd.pfi.PaymentProcessorRequest;
import io.tbd.tbdex.protocol.core.JsonParser;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.Ask;
import io.tbd.tbdex.protocol.messages.Close;
import io.tbd.tbdex.protocol.messages.OfferAccept;
import io.tbd.tbdex.protocol.messages.SettlementDetails;
import java.math.BigDecimal;

public class TestHelper {
  public static final PaymentInstrument PAYMENT_INSTRUMENT = new PaymentInstrument.Builder()
      .account_number("12345")
      .routing_number("12345")
      .build();

  public static final BillingDetails BILLING_DETAILS = new BillingDetails.Builder()
      .name("Satoshi Nakamoto")
      .city("Boston")
      .country("US")
      .line1("100 Money Street")
      .postalCode("01234")
      .district("MA")
      .build();

  public static final BankAddress BANK_ADDRESS = new BankAddress.Builder()
      .country("US")
      .build();

  public static Message askMessage(String threadToken) {
    return new Message.Builder("mid", threadToken, "alice", "pfi")
        .build(new Ask("USDC", BigDecimal.valueOf(100), "USDC"));
  }

  public static Message offerAccept(String threadToken) {
    return new Message.Builder("mid", threadToken, "alice", "pfi")
        .build(new OfferAccept());
  }

  public static Message settlementDetails(String threadToken) {
    PaymentProcessorRequest request = new PaymentProcessorRequest.Builder()
        .wallet_address("12345")
        .build();
    return new Message.Builder("mid", threadToken, "alice", "pfi")
        .build(new SettlementDetails(JsonParser.getParser().toJsonTree(request)));
  }

  public static Message close(String threadToken) {
    return new Message.Builder("mid", threadToken, "pfi", "alice")
        .build(new Close("close"));
  }
}
