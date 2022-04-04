package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.common.base.Preconditions;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageType;
import io.tbd.tbdex.protocol.messages.Close;
import io.tbd.tbdex.protocol.messages.OfferAccept;
import io.tbd.tbdex.protocol.processors.MessageProcessor;
import java.util.UUID;

public class OfferAcceptProcessorImpl implements MessageProcessor {
  @Override public Message process(Message message) {
    Preconditions.checkState(message.type() == MessageType.OfferAccept);
    OfferAccept offerAccept = (OfferAccept) message.body();



    String messageId = UUID.randomUUID().toString();

    // TODO: return a receipt of sorts
    return new Message.Builder(messageId, message.threadID(), "", "")
            .build(new Close("ohhhhh"));
  }
}
