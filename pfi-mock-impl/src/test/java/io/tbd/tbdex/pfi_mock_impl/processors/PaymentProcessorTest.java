package io.tbd.tbdex.pfi_mock_impl.processors;

import com.squareup.protos.tbd.pfi.PaymentProcessorRequest;
import io.tbd.tbdex.pfi_mock_impl.TestBase;
import io.tbd.tbdex.pfi_mock_impl.TestHelper;
import io.tbd.tbdex.protocol.core.JsonParser;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.messages.Ask;
import io.tbd.tbdex.protocol.messages.SettlementDetails;
import java.math.BigDecimal;
import javax.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class PaymentProcessorTest extends TestBase {
  @Inject MessageThreadStore threadStore;
  @Inject PaymentProcessor paymentProcessor;

  @Test
  @DisplayName("runs without error")
  void happyPath() {
    String threadToken = "thid";
    Message message1 = new Message.Builder("mid", threadToken, "pfi", "alice")
        .build(new Ask("USDC", BigDecimal.valueOf(100), "USDC"));
    threadStore.addMessageToThread(message1);

    PaymentProcessorRequest request = new PaymentProcessorRequest.Builder()
        .account_number(TestHelper.PAYMENT_INSTRUMENT.account_number)
        .routing_number(TestHelper.PAYMENT_INSTRUMENT.routing_number)
        .bank_address(TestHelper.BANK_ADDRESS)
        .billing_details(TestHelper.BILLING_DETAILS)
        .wallet_address("123")
        .email_address("123")
        .build();

    String body = JsonParser.getParser().toJson(request);

    SettlementDetails settlementDetails = new SettlementDetails(body);

    paymentProcessor.process(settlementDetails, threadToken);
  }
}
