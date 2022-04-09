package io.tbd.tbdex.pfi_mock_impl.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.SettlementRequest;
import io.tbd.tbdex.protocol.processors.OfferAcceptProcessor;
import java.util.UUID;

public class OfferAcceptProcessorImpl implements OfferAcceptProcessor {
  @Override public Message process(Message message) {
    // TODO: send real schema
    String messageId = UUID.randomUUID().toString();

    SettlementRequest settlementRequest = new SettlementRequest("schema");
    return new Message.Builder(messageId, message.threadID(), message.to(), message.from())
        .build(settlementRequest);
  }
}
