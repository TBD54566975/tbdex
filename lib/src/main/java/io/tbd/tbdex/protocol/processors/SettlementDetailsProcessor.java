package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.SettlementDetails;

public interface SettlementDetailsProcessor extends MessageProcessor {
    static SettlementDetails getSettlementDetailsFromMessage(Message message) {
        return (SettlementDetails) message.body();
    }
}
