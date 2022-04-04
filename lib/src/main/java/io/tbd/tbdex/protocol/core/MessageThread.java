package io.tbd.tbdex.protocol.core;

import io.tbd.tbdex.protocol.messages.Ask;

import javax.annotation.Nullable;
import java.util.LinkedList;

public class MessageThread {
    private LinkedList<Message> messageThread;

    public MessageThread() {
        this.messageThread = new LinkedList<>();
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

    public @Nullable
    Ask getAsk() {
        for(Message message : messageThread) {
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
