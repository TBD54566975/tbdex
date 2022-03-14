package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.OfferAccept;

public interface OfferAcceptProcessor extends MessageProcessor {
    static OfferAccept getOfferAcceptFromMessage(Message message) {
        return (OfferAccept) message.body();
    }
}
