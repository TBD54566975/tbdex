package io.tbd.tbdex.pfi_mock_impl.store;

import io.tbd.tbdex.protocol.core.Message;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "messages")
public class DbMessage extends TimestampedEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private long id;

  @Column(name = "thread_token")
  private String threadToken;

  @Column(name = "message", length = 65535, columnDefinition = "longblob")
  @Convert(converter = MessageConverter.class)
  private Message message;

  public long getId() {
    return id;
  }

  public String getThreadToken() {
    return threadToken;
  }

  public void setThreadToken(String threadToken) {
    this.threadToken = threadToken;
  }

  public Message getMessage() {
    return message;
  }

  public void setMessage(Message message) {
    this.message = message;
  }
}
