package io.tbd.tbdex.pfi_mock_impl.processors;

import io.tbd.tbdex.pfi_mock_impl.TestBase;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.core.MessageType;
import io.tbd.tbdex.protocol.messages.Ask;
import java.math.BigDecimal;
import javax.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AskProcessorTest extends TestBase {
  @Inject MessageThreadStore threadStore;
  @Inject MessageThreadProcessor processor;

  @Test
  @DisplayName("throws an exception response is not a conditional offer")
  void testReturnsConditionalOffer() {
    Message message = new Message.Builder("mid", "thid", "pfi", "alice")
        .build(new Ask("USD", BigDecimal.valueOf(100), "USDC"));

    Message response = processor.addMessage(message);
    Assertions.assertSame(response.type(), MessageType.ConditionalOffer);

    Assertions.assertSame(2, threadStore.getThread("thid").getSize());
  }
}
