package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.pfi_mock_impl.store.HibernateMessageThreadStore;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageType;

public class ProcessorModule extends AbstractModule {
  @Override protected void configure() {
    MessageThreadProcessor processor =
        // TODO: figure out how to grab thread store instance from injector
        new MessageThreadProcessor.Builder(new HibernateMessageThreadStore())
            .registerProcessor(MessageType.Ask, new AskProcessorImpl())
            .registerProcessor(MessageType.ConditionalOffer, new ConditionalOfferProcessorImpl())
            .registerProcessor(MessageType.OfferAccept, new OfferAcceptProcessorImpl())
            .registerProcessor(MessageType.Close, new CloseProcessorImpl())
            .build();

    bind(MessageThreadProcessor.class).toInstance(processor);
  }
}
