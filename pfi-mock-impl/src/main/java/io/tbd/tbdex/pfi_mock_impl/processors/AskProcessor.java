package io.tbd.tbdex.pfi_mock_impl.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageProcessor;
import io.tbd.tbdex.protocol.messages.Ask;
import io.tbd.tbdex.protocol.messages.ConditionalOffer;
import java.math.BigDecimal;
import java.util.UUID;

public class AskProcessor extends MessageProcessor<Ask> {
  @Override public Message process(Message message) {
    Ask ask = getBody(message);

    ConditionalOffer conditionalOffer = new ConditionalOffer(
        ask.sourceCurrency,
        ask.sourceAmount.multiply(BigDecimal.valueOf(0.98)), // Stand in for real offer.
        ask.targetCurrency
    );
    String messageId = UUID.randomUUID().toString();
    return new Message.Builder(messageId, message.threadID(), message.to(), message.from())
        .build(conditionalOffer);
  }
}
