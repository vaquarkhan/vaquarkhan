CREATE TABLE `camel_messageprocessed` (
  `processorName` varchar(255) NOT NULL,
  `messageId` varchar(100) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `processorName_messageId_UNIQUE` (`processorName`,`messageId`)
);

CREATE TABLE `record` (
  `record_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`record_id`)
);