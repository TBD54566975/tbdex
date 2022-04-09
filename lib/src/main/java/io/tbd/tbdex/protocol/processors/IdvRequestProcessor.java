package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.IdvRequest;

public interface IdvRequestProcessor extends MessageProcessor {
    static IdvRequest getIdvRequestFromMessage(Message message) {
        return (IdvRequest) message.body();
    }
}
