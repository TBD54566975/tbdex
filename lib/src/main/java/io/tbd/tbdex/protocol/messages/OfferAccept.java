package io.tbd.tbdex.protocol.messages;

import com.squareup.protos.tbd.pfi.PaymentProcessorRequest;
import io.tbd.tbdex.protocol.core.MessageBody;
import io.tbd.tbdex.protocol.core.MessageType;

public class OfferAccept extends MessageBody {
    public PaymentProcessorRequest paymentProcessorRequest;

    public OfferAccept(PaymentProcessorRequest paymentProcessorRequest) {
        super(MessageType.OfferAccept);

        this.paymentProcessorRequest = paymentProcessorRequest;

        this.addValidReplyTypes(MessageType.Close);
    }
}
