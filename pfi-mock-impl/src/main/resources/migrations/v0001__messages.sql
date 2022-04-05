CREATE TABLE IF NOT EXISTS messages (
  id           BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  thread_token VARCHAR(20) NOT NULL,
  message      longtext NOT NULL,
  created_at   TIMESTAMP NULL,
  updated_at   TIMESTAMP NULL,
  KEY idx_thread_token(thread_token)
);
