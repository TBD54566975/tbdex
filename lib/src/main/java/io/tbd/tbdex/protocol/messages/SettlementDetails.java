package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class SettlementDetails extends MessageBody {
    public String body;

    public SettlementDetails(String body) {
        super(MessageType.SettlementDetails);

        this.body = body;

        // TODO: Add correct ones
        this.addValidReplyTypes(MessageType.Close);
    }
}
