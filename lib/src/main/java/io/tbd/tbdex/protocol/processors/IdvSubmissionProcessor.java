package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.IdvSubmission;

public interface IdvSubmissionProcessor extends MessageProcessor {
    static IdvSubmission getIdvSubmissionFromMessage(Message message) {
        return (IdvSubmission) message.body();
    }
}
