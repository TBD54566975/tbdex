package io.tbd.tbdex.protocol.messages;

import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class Close extends MessageBody {
  String reason;

  public Close(String reason) {
    super(MessageType.Close);

    this.reason = reason;
  }
}
