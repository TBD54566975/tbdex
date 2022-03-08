package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;

public interface MessageProcessor {
     Message process(Message message);
}
