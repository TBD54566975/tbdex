package io.tbd.tbdex.pfi_mock_impl;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.pfi_mock_impl.payments.circle.CircleClient;
import io.tbd.tbdex.pfi_mock_impl.payments.circle.MockCircleClient;
import io.tbd.tbdex.pfi_mock_impl.processors.AskProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.processors.CloseProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.processors.OfferAcceptProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.payments.PaymentProcessor;
import io.tbd.tbdex.pfi_mock_impl.processors.SettlementDetailsProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.store.HibernateMessageThreadStore;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.core.MessageType;

public class ProcessorTestModule extends AbstractModule {
  @Override protected void configure() {
    MessageThreadStore threadStore = new HibernateMessageThreadStore();
    CircleClient circleClient = new MockCircleClient();
    MessageThreadProcessor processor = new MessageThreadProcessor.Builder(threadStore)
        .registerProcessor(MessageType.Ask,
            new AskProcessorImpl())
        .registerProcessor(MessageType.Close,
            new CloseProcessorImpl())
        .registerProcessor(MessageType.OfferAccept,
            new OfferAcceptProcessorImpl())
        .registerProcessor(MessageType.SettlementDetails,
            new SettlementDetailsProcessorImpl(new PaymentProcessor(circleClient)))
        .build();

    bind(MessageThreadProcessor.class).toInstance(processor);
    bind(MessageThreadStore.class).toInstance(threadStore);
    bind(CircleClient.class).toInstance(circleClient);
  }
}
