package io.tbd.tbdex.pfi_mock_impl.request_handlers;

import io.javalin.Context;
import io.javalin.Handler;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import org.jetbrains.annotations.NotNull;

public class MessageHandler implements Handler {
  MessageThreadStore store;
  MessageThreadProcessor processor;

  public MessageHandler(MessageThreadStore store, MessageThreadProcessor processor) {
    this.store = store;
    this.processor = processor;
  }

  @Override
  public void handle(@NotNull Context ctx) {
    Message message = Message.Builder.fromJson(ctx.body());
    Message reply = processor.addMessage(message);

    ctx.result(reply.toString());
  }
}
