package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.Close;

public interface CloseProcessor extends MessageProcessor {
  static Close getCloseFromMessage(Message message) {
    return (Close) message.body();
  }
}
