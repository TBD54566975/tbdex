package io.tbd.tbdex.pfi_mock_impl.store;

import java.util.Properties;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;
import org.hibernate.service.ServiceRegistry;

public class HibernateUtil {
  public static final int DB_PORT = 3307;
  public static final int MYSQL_DEFAULT_PORT = 3306;
  public static final String DB_NAME = "tbdex";
  public static final String DB_USER = "root";
  public static final String DB_PASS = "tbdev";

  private static SessionFactory sessionFactory;

  public static SessionFactory getSessionFactory() {
    if (sessionFactory == null) {
      try {
        Configuration configuration = new Configuration();

        // Hibernate settings equivalent to hibernate.cfg.xml's properties
        Properties settings = new Properties();
        settings.put(Environment.DRIVER, "com.mysql.jdbc.Driver");
        settings.put(Environment.URL, String.format("jdbc:mysql://localhost:%s/%s", DB_PORT, DB_NAME));
        settings.put(Environment.USER, DB_USER);
        settings.put(Environment.PASS, DB_PASS);
        settings.put(Environment.DIALECT, "org.hibernate.dialect.MySQL5Dialect");
        settings.put(Environment.HBM2DDL_AUTO, "update");

        configuration.setProperties(settings);

        configuration.addAnnotatedClass(DbMessage.class);

        ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
            .applySettings(configuration.getProperties()).build();

        sessionFactory = configuration.buildSessionFactory(serviceRegistry);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
    return sessionFactory;
  }

  public static Session getSession() {
    return HibernateUtil.getSessionFactory().openSession();
  }
}
