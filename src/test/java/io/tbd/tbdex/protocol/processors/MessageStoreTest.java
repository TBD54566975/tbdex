package io.tbd.tbdex.protocol.processors;

import com.google.inject.Inject;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThread;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.messages.Ask;
import java.math.BigDecimal;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class MessageStoreTest extends HibernateTestBase {
  @Inject MessageThreadStore threadStore;

  @Test
  @DisplayName("create DbMessage")
  void hibernateThreadStoreTest() {
    String threadToken = "thid";
    Message message1 = new Message.Builder("mid", threadToken, "pfi", "alice")
        .build(new Ask("USD", BigDecimal.valueOf(100), "USDC"));
    threadStore.addMessageToThread(message1);

    Assertions.assertEquals(threadStore.getThread(threadToken).getSize(), 1);

    Message message2 = new Message.Builder("mid2", threadToken, "pfi2", "alice2")
        .build(new Ask("USD", BigDecimal.valueOf(100), "USDC"));
    threadStore.addMessageToThread(message2);

    MessageThread messageThread = threadStore.getThread(threadToken);
    Assertions.assertEquals(messageThread.getSize(), 2);
    Assertions.assertEquals(messageThread.getLastMessage().id(), "mid2");
  }
}
