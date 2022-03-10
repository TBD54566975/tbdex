package io.tbd.tbdex.protocol.core;

public interface MessageThreadStore {
    MessageThread getThread(String threadToken);

    Message getLastMessage(String threadToken);

    void addMessageToThread(String threadToken, Message message);
}
