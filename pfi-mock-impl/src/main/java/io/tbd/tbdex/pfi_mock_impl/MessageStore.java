package io.tbd.tbdex.pfi_mock_impl;

import com.zaxxer.hikari.HikariDataSource;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThread;
import io.tbd.tbdex.protocol.core.MessageThreadStore;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

public class MessageStore implements MessageThreadStore  {
  DataSource dataSource;

  public MessageStore(Properties config) {
    HikariDataSource ds = new HikariDataSource();

    ds.setJdbcUrl(config.getProperty("db.jdbcUrl"));
    ds.setUsername(config.getProperty("db.username"));
    ds.setPassword(config.getProperty("db.password"));
    ds.setDriverClassName(config.getProperty("db.driverClassName"));

    this.dataSource = ds;
  }

  @Override
  public MessageThread getThread(String threadToken) {
    String query = "SELECT * FROM messages WHERE thread_token = ?";
    MessageThread thread = new MessageThread();

    try (Connection con = this.dataSource.getConnection();
         PreparedStatement pst = con.prepareStatement(query);
    ) {
      pst.setString(1, threadToken);

      try (ResultSet rs = pst.executeQuery()) {
        while (rs.next()) {
          String serializedMessage = rs.getString("message");
          Message message = Message.Builder.fromJson(serializedMessage);

          thread.addMessage(message);
        }
      }
    } catch(SQLException e) {
      throw new RuntimeException(e);
    }

    return thread;
  }

  @Override
  public Message getLastMessage(String threadToken) {
    return null;
  }

  @Override
  public void addMessageToThread(Message message) {
    String query = "INSERT into messages (thread_token, message) VALUES(?, ?)";

    try (
       Connection con = this.dataSource.getConnection();
       PreparedStatement pst = con.prepareStatement(query);
    ) {

      pst.setString(1, message.threadID());
      pst.setString(2, message.toString());

      pst.executeUpdate();
    } catch (SQLException e) {
      throw new RuntimeException(e);
    }
  }
}
