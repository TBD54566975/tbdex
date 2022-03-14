package io.tbd.tbdex.protocol.processors;

import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.messages.Ask;
import io.tbd.tbdex.protocol.store.DbMessage;
import java.math.BigDecimal;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class MessageStoreTest {
  @Test
  @DisplayName("create DbMessage")
  void test() {
    Configuration configuration = new Configuration().configure("hibernate.cfg.xml");
    SessionFactory sessionFactory = configuration.buildSessionFactory();
    Session session = sessionFactory.openSession();
    Transaction tx = session.getTransaction();
    try {
      // Delete all asks
      tx.begin();
      Query query = session.createQuery("from DbMessage");
      List<DbMessage> asks = query.list();
      System.out.println("Employees found: " + asks.size());
      for(DbMessage ask: asks) {
        session.delete(ask);
        System.out.println("Deleted " + ask);
      }
      tx.commit();

      query = session.createQuery("from DbMessage");
      Assertions.assertSame(query.list().size(), 0);


      Message message = new Message.Builder("mid", "thid", "pfi", "alice")
          .build(new Ask("USD", BigDecimal.valueOf(100), "USDC"));

      // Create new Ask
      tx = session.getTransaction();
      tx.begin();
      DbMessage ask = new DbMessage();
      ask.setThreadToken(message.threadID());
      ask.setMessage(message);
      session.saveOrUpdate(ask);
      tx.commit();

      query = session.createQuery("from DbMessage");
      Assertions.assertSame(query.list().size(), 1);
    } catch (RuntimeException e) {
      tx.rollback();
      throw e;

    } finally {
      session.close();
    }
  }
}
