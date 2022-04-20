package io.tbd.tbdex.pfi_mock_impl.processors;

import io.tbd.tbdex.pfi_mock_impl.TestBase;
import io.tbd.tbdex.pfi_mock_impl.TestHelper;
import io.tbd.tbdex.protocol.core.JsonParser;
import io.tbd.tbdex.protocol.core.MessageThread;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.messages.SettlementDetails;
import javax.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class SettlementDetailsProcessorTest extends TestBase {
  @Inject MessageThreadStore threadStore;
  @Inject MessageThreadProcessor processor;

  @Test
  @DisplayName("runs without error")
  void happyPath() {
    String threadToken = "thid";

    processor.addMessage(TestHelper.askMessage(threadToken));
    processor.addMessage(TestHelper.offerAccept(threadToken));
    processor.addMessage(TestHelper.settlementDetails(threadToken));

    MessageThread messageThread = threadStore.getThread("thid");
    Assertions.assertSame(6, messageThread.getSize());
  }

  @Test
  @DisplayName("runs without error")
  void jsonTest() {
    String threadToken = "thid";
    String body = JsonParser.getParser().toJson(TestHelper.settlementDetails(threadToken));
    SettlementDetails test = JsonParser.getParser().fromJson(body, SettlementDetails.class);

    Assertions.assertNotNull(test.body);
  }
}
