package io.tbd.tbdex.protocol.messages;

import com.squareup.protos.tbd.presentation_exchange.PresentationDefinition;
import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class IdvRequest extends MessageBody {
  PresentationDefinition presentationDefinition;

  public IdvRequest(PresentationDefinition presentationDefinition) {
    super(MessageType.IdvRequest);

    this.presentationDefinition = presentationDefinition;
  }
}
