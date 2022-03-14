package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.ConditionalOffer;

public interface ConditionalOfferProcessor extends MessageProcessor {
    static ConditionalOffer getConditionalOfferFromMessage(Message message) {
        return (ConditionalOffer) message.body();
    }
}
