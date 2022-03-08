package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class ConditionalOffer extends MessageBody {
    public ConditionalOffer() {
        super(MessageType.ConditionalOffer);
    }
}
