package io.tbd.tbdex.pfi_mock_impl.processors;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.protocol.processors.AskProcessor;
import io.tbd.tbdex.protocol.processors.CloseProcessor;
import io.tbd.tbdex.protocol.processors.ConditionalOfferProcessor;
import io.tbd.tbdex.protocol.processors.OfferAcceptProcessor;

public class ProcessorModule extends AbstractModule {
  @Override protected void configure() {
    bind(AskProcessor.class).to(MockAskProcessor.class);
    bind(CloseProcessor.class).to(MockCloseProcessor.class);
    bind(ConditionalOfferProcessor.class).to(MockConditionalOfferProcessor.class);
    bind(OfferAcceptProcessor.class).to(MockOfferAcceptProcessor.class);
  }
}
