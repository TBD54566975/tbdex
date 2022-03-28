package io.tbd.tbdex.pfi_mock_impl;

import com.google.inject.Guice;
import com.google.inject.Injector;
import io.javalin.Handler;
import io.javalin.Javalin;
import io.tbd.tbdex.pfi_mock_impl.circle.CircleModule;
import io.tbd.tbdex.pfi_mock_impl.processors.ProcessorModule;
import io.tbd.tbdex.pfi_mock_impl.store.HibernateModule;
import io.tbd.tbdex.pfi_mock_impl.store.MessageConverter;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;

public class Main {
  private static final Injector injector = Guice.createInjector(
      new HibernateModule(),
      new ProcessorModule(),
      new CircleModule()
  );

  public static void main(String[] args) {
    run();
  }

  public static void run() {
    Javalin app = Javalin.create().start(9004);
    injector.injectMembers(app);

    app.get("/hello-world", ctx -> ctx.result("Hello World"));
    app.post("/handle-message", handleMessage);
  }

  public static Handler handleMessage = ctx -> {
    MessageThreadProcessor processor = injector.getInstance(MessageThreadProcessor.class);
    Message message = new MessageConverter().convertToEntityAttribute(ctx.body());
    processor.addMessage(message);
  };
}
