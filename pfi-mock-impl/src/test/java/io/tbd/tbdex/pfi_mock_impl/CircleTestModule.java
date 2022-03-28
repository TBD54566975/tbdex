package io.tbd.tbdex.pfi_mock_impl;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.pfi_mock_impl.circle.client.CircleClient;
import io.tbd.tbdex.pfi_mock_impl.circle.client.MockCircleClient;

public class CircleTestModule extends AbstractModule {
  @Override protected void configure() {
    bind(CircleClient.class).to(MockCircleClient.class);
  }
}
