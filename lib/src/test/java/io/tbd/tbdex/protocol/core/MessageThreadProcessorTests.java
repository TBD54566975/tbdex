package io.tbd.tbdex.protocol.core;

import io.tbd.tbdex.protocol.messages.Close;
import javax.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MessageThreadProcessorTests extends TestBase {
    @Inject MessageThreadProcessor messageThreadProcessor;

    @Test
    @DisplayName("throws an exception if Ask is not the first message")
    void testAskNotFirstMessageThrowsException() {
        Message message = new Message.Builder("mid", "thid", "pfi", "alice")
            .build(new Close("but whai?"));

        RuntimeException thrown = Assertions.assertThrows(RuntimeException.class, () -> {
            messageThreadProcessor.addMessage(message);
        });

        Assertions.assertEquals("The first message in a thread can only be an Ask",
                thrown.getMessage());
    }

}
