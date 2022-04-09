package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.SettlementReceipt;

public interface SettlementReceiptProcessor extends MessageProcessor {
    static SettlementReceipt getSettlementReceiptFromMessage(Message message) {
        return (SettlementReceipt) message.body();
    }
}
