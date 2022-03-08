package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class Ask extends MessageBody {
    public String sourceCurrency;
    public int sourceAmount;
    public String targetCurrency;

    public Ask(String sourceCurrency, int sourceAmount, String targetCurrency) {
        super(MessageType.Ask);

        this.sourceCurrency = sourceCurrency;
        this.sourceAmount = sourceAmount;
        this.targetCurrency = targetCurrency;

        this.addValidReplyTypes(MessageType.ConditionalOffer, MessageType.Close);
    }
}
