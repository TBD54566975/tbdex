package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class SettlementReceipt extends MessageBody {
    public String receipt;

    public SettlementReceipt(String receipt) {
        super(MessageType.SettlementReceipt);

        this.receipt = receipt;
    }
}
