package io.tbd.tbdex.protocol.messages;

import com.google.gson.JsonObject;
import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class IdvRequest extends MessageBody {
    JsonObject presentationRequest;

    public IdvRequest(JsonObject presentationRequest) {
        super(MessageType.IdvRequest);

        this.presentationRequest = presentationRequest;
    }
}
