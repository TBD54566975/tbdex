package io.tbd.tbdex.protocol.core;

import com.google.inject.Guice;
import com.google.inject.Injector;
import io.tbd.tbdex.protocol.core.processors.ProcessorModule;
import org.junit.jupiter.api.BeforeEach;

public class TestBase {
  protected Injector injector = Guice.createInjector(
      new StoreModule(),
      new ProcessorModule()
  );

  @BeforeEach
  void setup() {
    injector.injectMembers(this);
  }
}
