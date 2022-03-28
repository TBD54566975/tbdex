package io.tbd.tbdex.pfi_mock_impl.circle;

import com.google.inject.AbstractModule;
import io.tbd.tbdex.pfi_mock_impl.circle.client.CircleClient;
import io.tbd.tbdex.pfi_mock_impl.circle.client.RealCircleClient;

public class CircleModule extends AbstractModule {
  @Override protected void configure() {
    bind(CircleClient.class).to(RealCircleClient.class);
  }
}
