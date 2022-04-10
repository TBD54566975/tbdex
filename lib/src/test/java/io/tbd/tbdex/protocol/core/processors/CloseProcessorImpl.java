package io.tbd.tbdex.protocol.core.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageProcessor;
import io.tbd.tbdex.protocol.messages.Close;

public class CloseProcessorImpl extends MessageProcessor<Close> {
  @Override public Message process(Message message) {
    return null;
  }
}
