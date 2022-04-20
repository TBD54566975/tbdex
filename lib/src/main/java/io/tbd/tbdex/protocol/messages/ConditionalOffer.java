package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;
import java.math.BigDecimal;

public class ConditionalOffer extends MessageBody {
  public String sourceCurrency;
  public BigDecimal targetAmount;
  public String targetCurrency;

  public ConditionalOffer(String sourceCurrency, BigDecimal targetAmount, String targetCurrency) {
    super(MessageType.ConditionalOffer);

    this.sourceCurrency = sourceCurrency;
    this.targetAmount = targetAmount;
    this.targetCurrency = targetCurrency;

    this.addValidReplyTypes(MessageType.OfferAccept, MessageType.Close);
  }
}
