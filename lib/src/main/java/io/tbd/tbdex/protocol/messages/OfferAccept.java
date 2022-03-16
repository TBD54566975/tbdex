package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class OfferAccept extends MessageBody {
    public OfferAccept() {
        super(MessageType.OfferAccept);
    }
}
