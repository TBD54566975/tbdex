package io.tbd.tbdex.pfi_mock_impl;

import io.javalin.Handler;
import io.javalin.Javalin;
import io.tbd.tbdex.pfi_mock_impl.processors.AskProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.processors.CloseProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.processors.ConditionalOfferProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.processors.OfferAcceptProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.store.HibernateMessageThreadStore;
import io.tbd.tbdex.pfi_mock_impl.store.MessageConverter;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageType;

public class Main {
  public static void main(String[] args) {
    run();
  }

  public static void run() {
    Javalin app = Javalin.create().start(9004);
    app.get("/hello-world", ctx -> ctx.result("Hello World"));
    app.post("/handle-message", handleMessage);
  }

  public static Handler handleMessage = ctx -> {
    MessageThreadProcessor processor =
        new MessageThreadProcessor.Builder(new HibernateMessageThreadStore())
          .registerProcessor(MessageType.Ask, new AskProcessorImpl())
          .registerProcessor(MessageType.ConditionalOffer, new ConditionalOfferProcessorImpl())
          .registerProcessor(MessageType.OfferAccept, new OfferAcceptProcessorImpl())
          .registerProcessor(MessageType.Close, new CloseProcessorImpl())
          .build();

    Message message = new MessageConverter().convertToEntityAttribute(ctx.body());
    processor.addMessage(message);
  };
}
