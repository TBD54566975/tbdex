package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.common.base.Preconditions;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageType;
import io.tbd.tbdex.protocol.messages.Ask;
import io.tbd.tbdex.protocol.messages.ConditionalOffer;
import io.tbd.tbdex.protocol.processors.AskProcessor;
import java.math.BigDecimal;
import java.util.UUID;

public class AskProcessorImpl implements AskProcessor {
  @Override public Message process(Message message) {
    Preconditions.checkState(message.type() == MessageType.Ask);
    Ask ask = (Ask) message.body();

    String messageId = UUID.randomUUID().toString();

    ConditionalOffer conditionalOffer = new ConditionalOffer(
        ask.sourceCurrency,
        ask.sourceAmount.multiply(BigDecimal.valueOf(0.98)), // Stand in for real offer.
        ask.targetCurrency
    );

    return new Message.Builder(messageId, message.threadID(), message.to(), message.from())
        .build(conditionalOffer);
  }
}
