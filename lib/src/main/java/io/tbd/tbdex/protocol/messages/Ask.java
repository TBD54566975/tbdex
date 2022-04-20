package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;
import java.math.BigDecimal;

public class Ask extends MessageBody {
  public String sourceCurrency;
  public BigDecimal sourceAmount;
  public String targetCurrency;

  public Ask(String sourceCurrency, BigDecimal sourceAmount, String targetCurrency) {
    super(MessageType.Ask);

    this.sourceCurrency = sourceCurrency;
    this.sourceAmount = sourceAmount;
    this.targetCurrency = targetCurrency;

    this.addValidReplyTypes(MessageType.ConditionalOffer, MessageType.Close);
  }
}
