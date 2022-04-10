package io.tbd.tbdex.pfi_mock_impl.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageProcessor;
import io.tbd.tbdex.protocol.messages.OfferAccept;
import io.tbd.tbdex.protocol.messages.SettlementRequest;
import java.util.UUID;

public class OfferAcceptProcessorImpl extends MessageProcessor<OfferAccept> {
  @Override public Message process(Message message) {
    String messageId = UUID.randomUUID().toString();

    // TODO: send real schema
    SettlementRequest settlementRequest = new SettlementRequest("schema");
    return new Message.Builder(messageId, message.threadID(), message.to(), message.from())
        .build(settlementRequest);
  }
}
