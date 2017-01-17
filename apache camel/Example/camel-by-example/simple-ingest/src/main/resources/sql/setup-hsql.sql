DROP TABLE IF EXISTS camel_messageprocessed;

CREATE TABLE IF NOT EXISTS camel_messageprocessed (
  processorName VARCHAR(255),
  messageId VARCHAR(100),
  createdAt TIMESTAMP,
  CONSTRAINT UK_1
    UNIQUE (processorName, messageId)
);

DROP TABLE IF EXISTS record;

CREATE TABLE record (
  record_id int(11) NOT NULL,
  date datetime NOT NULL,
  PRIMARY KEY (`record_id`)
);
