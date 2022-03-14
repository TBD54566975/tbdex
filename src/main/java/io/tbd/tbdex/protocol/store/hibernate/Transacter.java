package io.tbd.tbdex.protocol.store.hibernate;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class Transacter {
  public static Session getSession() {
    Configuration configuration = new Configuration().configure("hibernate.cfg.xml");
    SessionFactory sessionFactory = configuration.buildSessionFactory();
    return sessionFactory.openSession();
  }
}
