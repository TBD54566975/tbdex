package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageType;
import io.tbd.tbdex.protocol.messages.Ask;
import java.math.BigDecimal;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AskProcessorTest {
  @Test
  @DisplayName("throws an exception response is not a conditional offer")
  void testReturnsConditionalOffer() {
    Message message = new Message.Builder("mid", "thid", "pfi", "alice")
        .build(new Ask("USD", BigDecimal.valueOf(100), "USDC"));

    Message response = new AskProcessor().process(message);
    Assertions.assertSame(response.type(), MessageType.ConditionalOffer);
  }
}
