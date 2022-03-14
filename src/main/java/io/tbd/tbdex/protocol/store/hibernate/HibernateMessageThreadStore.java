package io.tbd.tbdex.protocol.store.hibernate;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThread;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.store.DbMessage;
import java.util.LinkedList;
import java.util.stream.Collectors;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class HibernateMessageThreadStore implements MessageThreadStore {
  @SuppressWarnings("unchecked")
  @Override public MessageThread getThread(String threadToken) {
    Session session = Transacter.getSession();
    Transaction tx = session.getTransaction();
    tx.begin();
    Query query = session.createQuery(
        // TODO: add a message order field, using created_at is just temporary
        "from DbMessage where thread_token=:t order by created_at asc"
    ).setParameter("t", threadToken);

    LinkedList<Message> messages = (LinkedList<Message>) query.list()
        .stream()
        .map(m -> ((DbMessage) m).getMessage())
        .collect(Collectors.toCollection(LinkedList::new));

    tx.commit();
    session.close();
    return new MessageThread(messages);
  }

  @Override public Message getLastMessage(String threadToken) {
    MessageThread messageThread = getThread(threadToken);
    return messageThread.getLastMessage();
  }

  @Override public void addMessageToThread(Message message) {
    Session session = Transacter.getSession();
    Transaction tx = session.getTransaction();
    tx.begin();
    DbMessage ask = new DbMessage();
    ask.setThreadToken(message.threadID());
    ask.setMessage(message);
    session.save(ask);
    tx.commit();
    session.close();
  }
}
