package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.Ask;


public interface AskProcessor extends MessageProcessor {
    static Ask getAskFromMessage(Message message) {
        return (Ask) message.body();
    }
}
