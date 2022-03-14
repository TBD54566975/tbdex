package io.tbd.tbdex.protocol;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThread;
import io.tbd.tbdex.protocol.core.MessageThreadStore;

import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

public class InMemoryMessageThreadStore implements MessageThreadStore  {
    Map<String, MessageThread> threadStore;


    public InMemoryMessageThreadStore() {
        this.threadStore = new HashMap<>();
    }

    @Override
    public @Nullable MessageThread getThread(String threadToken) {
        return this.threadStore.getOrDefault(threadToken, null);
    }

    @Override
    public @Nullable Message getLastMessage(String threadToken) {
        MessageThread thread = this.getThread(threadToken);

        if (thread == null) {
            return null;
        }

        return thread.getLastMessage();
    }

    @Override
    public void addMessageToThread(Message message) {
        MessageThread thread = this.getThread(message.threadID());

        if (thread == null) {
            throw new RuntimeException("Thread " + message.threadID() + " does not exist.");
        }

        thread.addMessage(message);
    }
}
