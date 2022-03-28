package io.tbd.tbdex.pfi_mock_impl.processors;

import com.squareup.protos.tbd.pfi.PaymentProcessorRequest;
import io.tbd.tbdex.pfi_mock_impl.TestBase;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThread;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.core.MessageType;
import io.tbd.tbdex.protocol.messages.Ask;
import io.tbd.tbdex.protocol.messages.OfferAccept;
import java.math.BigDecimal;
import javax.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class OfferAcceptProcessorTest extends TestBase {
  @Inject MessageThreadStore threadStore;

  @Test
  @DisplayName("runs without error")
  void happyPath() {
    MessageThreadProcessor threadProcessor = new MessageThreadProcessor.Builder(threadStore)
        .registerProcessor(MessageType.Ask, new AskProcessorImpl())
        .registerProcessor(MessageType.OfferAccept, new OfferAcceptProcessorImpl())
        .build();

    String threadToken = "thid";
    Message askMessage = new Message.Builder("mid", threadToken, "pfi", "alice")
        .build(new Ask("USDC", BigDecimal.valueOf(100), "USDC"));
    threadProcessor.addMessage(askMessage);

    PaymentProcessorRequest request = new PaymentProcessorRequest.Builder()
        .wallet_address("12345")
        .thread_token(threadToken)
        .build();
    Message offerAcceptMessage = new Message.Builder("mid", threadToken, "pfi", "alice")
        .build(new OfferAccept(request));
    threadProcessor.addMessage(offerAcceptMessage);

    MessageThread messageThread = threadStore.getThread("thid");
    Assertions.assertSame(3, messageThread.getSize());
  }
}
