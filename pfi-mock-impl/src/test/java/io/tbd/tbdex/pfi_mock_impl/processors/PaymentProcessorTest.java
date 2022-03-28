package io.tbd.tbdex.pfi_mock_impl.processors;

import com.squareup.protos.tbd.pfi.PaymentProcessorRequest;
import io.tbd.tbdex.pfi_mock_impl.TestBase;
import io.tbd.tbdex.pfi_mock_impl.circle.MockCircleClient;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.messages.Ask;
import java.math.BigDecimal;
import javax.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class PaymentProcessorTest extends TestBase {
  @Inject MessageThreadStore threadStore;

  @Test
  @DisplayName("runs without error")
  void requestNotValid() {
    PaymentProcessor paymentProcessor = new PaymentProcessor(new MockCircleClient());

    String threadToken = "thid";
    Message message1 = new Message.Builder("mid", threadToken, "pfi", "alice")
        .build(new Ask("USDC", BigDecimal.valueOf(100), "USDC"));
    threadStore.addMessageToThread(message1);

    PaymentProcessorRequest request = new PaymentProcessorRequest.Builder()
        .wallet_address("12345")
        .thread_token(threadToken)
        .build();

    paymentProcessor.process(request);
  }
}
