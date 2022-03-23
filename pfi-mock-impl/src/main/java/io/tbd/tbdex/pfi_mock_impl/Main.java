package io.tbd.tbdex.pfi_mock_impl;

import io.javalin.Handler;
import io.javalin.Javalin;
import io.tbd.tbdex.pfi_mock_impl.processors.MockAskProcessor;
import io.tbd.tbdex.pfi_mock_impl.processors.MockCloseProcessor;
import io.tbd.tbdex.pfi_mock_impl.processors.MockConditionalOfferProcessor;
import io.tbd.tbdex.pfi_mock_impl.processors.MockOfferAcceptProcessor;
import io.tbd.tbdex.pfi_mock_impl.store.HibernateMessageThreadStore;
import io.tbd.tbdex.pfi_mock_impl.store.MessageConverter;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageType;

public class Main {
  public static void main(String[] args) {
    run();
    System.out.println("wew hew");
  }

  public static void run() {
    Javalin app = Javalin.create().start(9004);
    app.post("/handle-message", handleMessage);
  }

  public static Handler handleMessage = ctx -> {
    MessageThreadProcessor processor =
        new MessageThreadProcessor.Builder(new HibernateMessageThreadStore())
          .registerProcessor(MessageType.Ask, new MockAskProcessor())
          .registerProcessor(MessageType.ConditionalOffer, new MockConditionalOfferProcessor())
          .registerProcessor(MessageType.OfferAccept, new MockOfferAcceptProcessor())
          .registerProcessor(MessageType.Close, new MockCloseProcessor())
          .build();

    Message message = new MessageConverter().convertToEntityAttribute(ctx.body());
    processor.addMessage(message);
  };
}
