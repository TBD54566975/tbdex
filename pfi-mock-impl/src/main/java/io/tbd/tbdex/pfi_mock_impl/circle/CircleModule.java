package io.tbd.tbdex.pfi_mock_impl.circle;

import com.google.inject.AbstractModule;

public class CircleModule extends AbstractModule {
  @Override protected void configure() {
    bind(CircleClient.class).to(RealCircleClient.class);
  }
}
