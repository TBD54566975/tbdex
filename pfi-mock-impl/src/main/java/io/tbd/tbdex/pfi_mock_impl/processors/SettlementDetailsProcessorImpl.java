package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.common.base.Preconditions;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageType;
import io.tbd.tbdex.protocol.messages.OfferAccept;
import io.tbd.tbdex.protocol.messages.SettlementDetails;
import io.tbd.tbdex.protocol.processors.OfferAcceptProcessor;

public class SettlementDetailsProcessorImpl implements OfferAcceptProcessor {
  PaymentProcessor paymentProcessor;

  public SettlementDetailsProcessorImpl(PaymentProcessor paymentProcessor) {
    this.paymentProcessor = paymentProcessor;
  }

  @Override public Message process(Message message) {
    Preconditions.checkState(message.type() == MessageType.SettlementDetails);
    SettlementDetails settlementDetails = (SettlementDetails) message.body();

    paymentProcessor.process(settlementDetails, message.threadID());

    // TODO: return a receipt of sorts
    return null;
  }
}
