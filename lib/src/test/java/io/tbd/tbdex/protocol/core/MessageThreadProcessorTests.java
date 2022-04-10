package io.tbd.tbdex.protocol.core;

import io.tbd.tbdex.protocol.InMemoryMessageThreadStore;
import io.tbd.tbdex.protocol.core.processors.AskProcessorImpl;
import io.tbd.tbdex.protocol.core.processors.CloseProcessorImpl;
import io.tbd.tbdex.protocol.core.processors.OfferAcceptProcessorImpl;
import io.tbd.tbdex.protocol.messages.Close;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MessageThreadProcessorTests {
  MessageThreadStore threadStore = new InMemoryMessageThreadStore();
  MessageThreadProcessor processor = new MessageThreadProcessor.Builder(threadStore)
      .registerProcessor(MessageType.Ask,
          new AskProcessorImpl())
      .registerProcessor(MessageType.Close,
          new CloseProcessorImpl())
      .registerProcessor(MessageType.OfferAccept,
          new OfferAcceptProcessorImpl())
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
