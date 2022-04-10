package io.tbd.tbdex.protocol.core;

import io.tbd.tbdex.protocol.messages.Ask;
import java.util.LinkedList;
import javax.annotation.Nullable;

public class MessageThread {
  private LinkedList<Message> messageThread;

  public MessageThread(LinkedList<Message> messageThread) {
    this.messageThread = messageThread;
  }

  public MessageThread(Message message) {
    super();

    this.addMessage(message);
  }

  public void addMessage(Message message) {
    this.messageThread.add(message);
  }

  public Message getLastMessage() {
    if (this.messageThread.isEmpty()) {
      return null;
    }

    return this.messageThread.getLast();
  }

  public @Nullable Ask getAsk() {
    for (Message message : messageThread) {
      if (message.type() == MessageType.Ask) {
        return (Ask) message.body();
      }
    }
    return null;
  }

  public boolean isEmpty() {
    return this.messageThread.isEmpty();
  }

  public int getSize() {
    return messageThread.size();
  }
}
