package io.tbd.tbdex.protocol.core.processors;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.protocol.processors.AskProcessor;
import io.tbd.tbdex.protocol.processors.CloseProcessor;
import io.tbd.tbdex.protocol.processors.ConditionalOfferProcessor;
import io.tbd.tbdex.protocol.processors.OfferAcceptProcessor;

public class ProcessorModule extends AbstractModule {
  @Override protected void configure() {
    bind(AskProcessor.class).to(AskProcessorImpl.class);
    bind(CloseProcessor.class).to(CloseProcessorImpl.class);
    bind(ConditionalOfferProcessor.class).to(ConditionalOfferProcessorImpl.class);
    bind(OfferAcceptProcessor.class).to(OfferAcceptProcessorImpl.class);
  }
}
