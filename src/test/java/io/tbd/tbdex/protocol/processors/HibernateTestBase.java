package io.tbd.tbdex.protocol.processors;

import com.google.inject.Guice;
import com.google.inject.Injector;
import io.tbd.tbdex.protocol.store.DbMessage;
import io.tbd.tbdex.protocol.store.hibernate.HibernateModule;
import io.tbd.tbdex.protocol.store.hibernate.Transacter;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.junit.jupiter.api.BeforeEach;

public class HibernateTestBase {
  protected Injector injector = Guice.createInjector(new HibernateModule());

  @BeforeEach
  void setup() {
    truncateTables();
    injector.injectMembers(this);
  }

  private void truncateTables() {
    Session session = Transacter.getSession();
    Transaction tx = session.getTransaction();

    // Delete all messages
    tx.begin();
    Query query = session.createQuery("from DbMessage");
    List<DbMessage> asks = query.list();
    System.out.println("Employees found: " + asks.size());
    for(DbMessage ask: asks) {
      session.delete(ask);
      System.out.println("Deleted " + ask);
    }
    tx.commit();
    session.close();
  }
}
