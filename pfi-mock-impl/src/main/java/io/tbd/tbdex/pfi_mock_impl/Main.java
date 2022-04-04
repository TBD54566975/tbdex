package io.tbd.tbdex.pfi_mock_impl;

import io.javalin.Javalin;
import io.javalin.core.HandlerType;
import io.tbd.tbdex.pfi_mock_impl.processors.AskProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.processors.CloseProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.processors.OfferAcceptProcessorImpl;
import io.tbd.tbdex.pfi_mock_impl.request_handlers.HealthCheckHandler;
import io.tbd.tbdex.pfi_mock_impl.request_handlers.MessageHandler;
import io.tbd.tbdex.protocol.core.MessageThreadProcessor;
import io.tbd.tbdex.protocol.core.MessageType;

import java.io.IOException;
import java.util.Properties;

public class Main {
  public static void main(String[] args) throws IOException {
    String environment = System.getenv("ENVIRONMENT");
    if (environment == null) {
      environment = "development";
    }

    Properties config = getConfig(environment);

    MessageStore store = new MessageStore(config);
    MessageThreadProcessor processor = new MessageThreadProcessor.Builder(store)
       .registerProcessor(MessageType.Ask, new AskProcessorImpl())
       .registerProcessor(MessageType.OfferAccept, new OfferAcceptProcessorImpl())
       .registerProcessor(MessageType.Close, new CloseProcessorImpl())
       .build();

    Javalin app = Javalin.create();
    app.addHandler(HandlerType.POST, "/message", new MessageHandler(store, processor));
    app.addHandler(HandlerType.GET, "/health", new HealthCheckHandler());

    int port = Integer.parseInt(config.getProperty("server.port"));
    app.start(port);
  }

  public static Properties getConfig(String environment) throws IOException {
    Properties properties = new Properties();

    properties.load(Main.class.getResourceAsStream("/config/base.properties"));
    properties.load(Main.class.getResourceAsStream("/config/" + environment + ".properties"));

    for (String propertyName : properties.stringPropertyNames()) {
      String override = System.getenv(propertyName.toUpperCase());

      if (override != null) {
        properties.setProperty(propertyName, override);
      }
    }

    return properties;
  }
}
