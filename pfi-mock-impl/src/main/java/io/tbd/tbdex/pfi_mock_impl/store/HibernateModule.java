package io.tbd.tbdex.pfi_mock_impl.store;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.protocol.core.MessageThreadStore;

public class HibernateModule extends AbstractModule {
  @Override protected void configure() {
    bind(MessageThreadStore.class).to(HibernateMessageThreadStore.class);
  }
}
