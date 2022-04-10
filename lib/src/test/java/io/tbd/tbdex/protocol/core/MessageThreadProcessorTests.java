package io.tbd.tbdex.protocol.core;

import io.tbd.tbdex.protocol.InMemoryMessageThreadStore;
import io.tbd.tbdex.protocol.core.processors.AskProcessor;
import io.tbd.tbdex.protocol.core.processors.CloseProcessor;
import io.tbd.tbdex.protocol.core.processors.OfferAcceptProcessor;
import io.tbd.tbdex.protocol.messages.Close;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MessageThreadProcessorTests {
  MessageThreadStore threadStore = new InMemoryMessageThreadStore();
  MessageThreadProcessor processor = new MessageThreadProcessor.Builder(threadStore)
      .registerProcessor(MessageType.Ask,
          new AskProcessor())
      .registerProcessor(MessageType.Close,
          new CloseProcessor())
      .registerProcessor(MessageType.OfferAccept,
          new OfferAcceptProcessor())
      .build();

  @Test
  @DisplayName("throws an exception if Ask is not the first message")
  void testAskNotFirstMessageThrowsException() {
    Message message = new Message.Builder("mid", "thid", "pfi", "alice")
        .build(new Close("but whai?"));

    RuntimeException thrown = Assertions.assertThrows(RuntimeException.class, () -> {
      processor.addMessage(message);
    });

    Assertions.assertEquals("The first message in a thread can only be an Ask",
        thrown.getMessage());
  }
}
