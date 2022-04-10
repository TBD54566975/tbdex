package io.tbd.tbdex.pfi_mock_impl.processors;

import io.tbd.tbdex.pfi_mock_impl.TestBase;
import io.tbd.tbdex.pfi_mock_impl.TestHelper;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import javax.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class CloseProcessorTest extends TestBase {
  @Inject MessageThreadProcessor processor;

  @Test
  @DisplayName("throws an exception if message sent after close")
  void errorForMessageAfterClose() {
    String threadToken = "thid";

    processor.addMessage(TestHelper.askMessage(threadToken));
    processor.addMessage(TestHelper.close(threadToken));

    RuntimeException thrown = Assertions.assertThrows(RuntimeException.class, () -> {
      processor.addMessage(TestHelper.offerAccept(threadToken));
    });

    Assertions.assertEquals("OfferAccept is not a valid reply to the most recent message [Close] in this thread",
        thrown.getMessage());
  }
}
