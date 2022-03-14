CREATE DATABASE `tbdex-protocol`;

USE `tbdex-protocol`;

CREATE TABLE messages (
  id           BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  thread_token VARCHAR(20) NOT NULL,
  message      longtext NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_thread_token(thread_token)
);
