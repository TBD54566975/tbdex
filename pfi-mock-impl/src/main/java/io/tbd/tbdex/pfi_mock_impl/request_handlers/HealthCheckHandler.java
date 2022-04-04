package io.tbd.tbdex.pfi_mock_impl.request_handlers;

import io.javalin.Context;
import io.javalin.Handler;
import org.jetbrains.annotations.NotNull;

public class HealthCheckHandler implements Handler {
  @Override
  public void handle(@NotNull Context ctx) throws Exception {
    ctx.status(200);
    ctx.result("OK");
  }
}
