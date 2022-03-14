package io.tbd.tbdex.protocol.store;

import io.tbd.tbdex.protocol.core.JsonParser;
import io.tbd.tbdex.protocol.core.Message;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply=true)
public class MessageConverter implements AttributeConverter<Message, String> {

  @Override
  public String convertToDatabaseColumn(Message message) {

    String messageJson = null;
    try {
      messageJson = JsonParser.getParser().toJson(message);
    } catch (Exception e) {
      System.out.println(e);
    }

    return messageJson;
  }

  @Override
  public Message convertToEntityAttribute(String messageJSON) {

    Message message = null;
    try {
      message = Message.Builder.fromJson(messageJSON);
    } catch (Exception e) {
      System.out.println(e);
    }

    return message;
  }
}
