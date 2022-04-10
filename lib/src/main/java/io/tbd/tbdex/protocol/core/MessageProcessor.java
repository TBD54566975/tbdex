package io.tbd.tbdex.protocol.core;

public abstract class MessageProcessor<T extends MessageBody> {

  protected abstract Message process(Message message);

  @SuppressWarnings("unchecked")
  protected T getBody(Message message) {
    return (T) message.body();
  }
}
