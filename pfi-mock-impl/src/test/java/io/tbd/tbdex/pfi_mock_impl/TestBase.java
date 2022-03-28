package io.tbd.tbdex.pfi_mock_impl;

import com.google.inject.Guice;
import com.google.inject.Injector;
import io.tbd.tbdex.pfi_mock_impl.processors.ProcessorModule;
import io.tbd.tbdex.pfi_mock_impl.store.DbMessage;
import io.tbd.tbdex.pfi_mock_impl.store.HibernateModule;
import io.tbd.tbdex.pfi_mock_impl.store.HibernateUtil;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.junit.jupiter.api.BeforeEach;

public class TestBase {
  protected Injector injector = Guice.createInjector(
      new HibernateModule(),
      new ProcessorModule(),
      new CircleTestModule()
  );

  @BeforeEach
  void setup() {
    truncateTables();
    injector.injectMembers(this);
  }

  private void truncateTables() {
    Session session = HibernateUtil.getSession();
    Transaction tx = session.getTransaction();

    // Delete all messages
    tx.begin();
    Query query = session.createQuery("from DbMessage");
    List<DbMessage> messages = query.list();
    System.out.println("Found: " + messages.size());
    for(DbMessage message: messages) {
      session.delete(message);
      System.out.println("Deleted " + message);
    }
    tx.commit();
    session.close();
  }
}
