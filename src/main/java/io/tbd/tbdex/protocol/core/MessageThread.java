package io.tbd.tbdex.protocol.core;

import java.util.LinkedList;

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

    public int getSize() {
        return messageThread.size();
    }

    public boolean isEmpty() {
        return this.messageThread.isEmpty();
    }
}
