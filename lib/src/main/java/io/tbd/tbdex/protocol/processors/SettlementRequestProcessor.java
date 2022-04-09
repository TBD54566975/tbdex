package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.SettlementRequest;

public interface SettlementRequestProcessor extends MessageProcessor {
    static SettlementRequest getSettlementRequestFromMessage(Message message) {
        return (SettlementRequest) message.body();
    }
}
