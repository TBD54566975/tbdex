package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.common.base.Preconditions;
import com.google.inject.Inject;
import io.tbd.tbdex.pfi_mock_impl.circle.client.CircleClient;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageType;
import io.tbd.tbdex.protocol.messages.OfferAccept;
import io.tbd.tbdex.protocol.processors.OfferAcceptProcessor;

public class OfferAcceptProcessorImpl implements OfferAcceptProcessor {
  // @Inject CircleClient circleClient;

  @Override public Message process(Message message) {
    // TODO
    //PaymentProcessor paymentProcessor = new PaymentProcessor(circleClient);
    Preconditions.checkState(message.type() == MessageType.OfferAccept);
    OfferAccept offerAccept = (OfferAccept) message.body();

    //paymentProcessor.process(offerAccept.paymentProcessorRequest);

    // TODO: return a receipt of sorts
    return null;
  }
}
