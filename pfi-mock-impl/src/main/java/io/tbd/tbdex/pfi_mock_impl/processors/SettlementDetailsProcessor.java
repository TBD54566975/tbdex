package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.common.base.Preconditions;
import io.tbd.tbdex.pfi_mock_impl.payments.PaymentProcessor;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageProcessor;
import io.tbd.tbdex.protocol.core.MessageType;
import io.tbd.tbdex.protocol.messages.SettlementDetails;
import io.tbd.tbdex.protocol.messages.SettlementReceipt;
import java.util.UUID;

public class SettlementDetailsProcessor extends MessageProcessor<SettlementDetails> {
  PaymentProcessor paymentProcessor;

  public SettlementDetailsProcessor(PaymentProcessor paymentProcessor) {
    this.paymentProcessor = paymentProcessor;
  }

  @Override public Message process(Message message) {
    Preconditions.checkState(message.type() == MessageType.SettlementDetails);
    SettlementDetails settlementDetails = getBody(message);
    paymentProcessor.process(settlementDetails, message.threadID());

    String messageId = UUID.randomUUID().toString();
    return new Message.Builder(messageId, message.threadID(), message.to(), message.from())
        .build(new SettlementReceipt("receipt"));
  }
}
