package io.tbd.tbdex.protocol.messages;

import com.squareup.protos.tbd.presentation_exchange.PresentationSubmission;
import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class IdvSubmission extends MessageBody {
  PresentationSubmission presentationSubmission;

  public IdvSubmission(PresentationSubmission presentationSubmission) {
    super(MessageType.IdvSubmission);

    this.presentationSubmission = presentationSubmission;
  }
}
