package io.tbd.tbdex.protocol.core.processors;

import com.google.inject.AbstractModule;

public class ProcessorModule extends AbstractModule {
  @Override protected void configure() {
    bind(AskProcessor.class).to(AskProcessorImpl.class);
    bind(CloseProcessor.class).to(CloseProcessorImpl.class);
    bind(ConditionalOfferProcessor.class).to(ConditionalOfferProcessorImpl.class);
    bind(OfferAcceptProcessor.class).to(OfferAcceptProcessorImpl.class);
  }
}
