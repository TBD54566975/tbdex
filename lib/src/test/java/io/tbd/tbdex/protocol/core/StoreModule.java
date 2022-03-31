package io.tbd.tbdex.protocol.core;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.protocol.InMemoryMessageThreadStore;

public class StoreModule extends AbstractModule {
  @Override protected void configure() {
    bind(MessageThreadStore.class).to(InMemoryMessageThreadStore.class);
  }
}
