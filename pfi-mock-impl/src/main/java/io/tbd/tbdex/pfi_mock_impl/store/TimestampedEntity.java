package io.tbd.tbdex.pfi_mock_impl.store;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import org.joda.time.DateTime;

/** Concrete base class for types that have creation/modification timestamps */
@MappedSuperclass
public class TimestampedEntity {
  @Column(name = "created_at", updatable = false)
  private DateTime createdAt;

  @Column(name = "updated_at")
  private DateTime updatedAt;

  public DateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(DateTime createdAt) {
    this.createdAt = createdAt;
  }

  public DateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(DateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
