package io.tbd.tbdex.protocol.store.hibernate;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.protocol.core.MessageThreadStore;

public class HibernateModule extends AbstractModule {
  @Override protected void configure() {
    bind(MessageThreadStore.class).to(HibernateMessageThreadStore.class);
  }
}
