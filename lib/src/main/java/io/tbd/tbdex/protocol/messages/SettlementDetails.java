package io.tbd.tbdex.protocol.messages;

import com.google.gson.JsonElement;
import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class SettlementDetails extends MessageBody {
  public JsonElement body;

  public SettlementDetails(JsonElement body) {
    super(MessageType.SettlementDetails);

    this.body = body;

    this.addValidReplyTypes(MessageType.SettlementReceipt, MessageType.Close);
  }
}
