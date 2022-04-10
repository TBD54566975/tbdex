package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class SettlementRequest extends MessageBody {
  public String schema;

  public SettlementRequest(String schema) {
    super(MessageType.SettlementRequest);

    this.schema = schema;

    this.addValidReplyTypes(MessageType.SettlementDetails, MessageType.Close);
  }
}
