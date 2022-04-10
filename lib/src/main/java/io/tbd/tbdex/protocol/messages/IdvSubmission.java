package io.tbd.tbdex.protocol.messages;

import com.google.gson.JsonObject;
import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class IdvSubmission extends MessageBody {
  JsonObject presentationSubmission;

  public IdvSubmission(JsonObject presentationSubmission) {
    super(MessageType.IdvSubmission);

    this.presentationSubmission = presentationSubmission;
  }
}
