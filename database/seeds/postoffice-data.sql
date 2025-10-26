-- Post Office Sample Data

-- Insert sample data for authentication
INSERT INTO `authentication` VALUES
(1,'OscarTheGrouch@email.com','pass1234','2025-10-22 20:45:21','2025-10-22 20:45:21'),
(5,'jane.doe@example.com','password123','2025-10-25 02:00:57','2025-10-25 02:00:57'),
(8,'luffy@onepiece.com','onepieceisreal','2025-10-25 02:31:35','2025-10-25 02:31:35'),
(9,'montyPython@grail.com','tisbutascratch','2025-10-25 02:42:49','2025-10-25 02:42:49'),
(11,'shrek@swamp.com','password123','2025-10-25 17:48:45','2025-10-25 17:48:45'),
(12,'bossbaby@pixar.com','boss','2025-10-25 19:25:54','2025-10-25 19:25:54');

-- Insert sample data for address
INSERT INTO `address` VALUES
(1,'Sesame Street','New York City','NY','12345',NULL,NULL,'2025-10-22 20:47:23','2025-10-22 20:47:23'),
(3,'123 Main St','Houston','TX','77004',5,5,'2025-10-25 02:00:57','2025-10-25 02:00:57'),
(6,'Laugh Tale','Grand Line','OP','12345',8,8,'2025-10-25 02:31:35','2025-10-25 02:31:35'),
(7,'Epping Forest','Camelot','GL','93472',9,9,'2025-10-25 02:42:49','2025-10-25 02:42:49'),
(8,'Shrek\'s Swamp','Lordship of Duloc','FL','94375',NULL,NULL,'2025-10-25 17:52:28','2025-10-25 17:52:28'),
(9,'Royal Oak','Toledo','OH','55533',NULL,NULL,'2025-10-25 19:28:07','2025-10-25 19:28:07');

-- Insert sample data for customer
INSERT INTO `customer` VALUES
(1,'Oscar',NULL,'Bruno',1,NULL,1,'individual','1969-06-01',NULL,NULL,'2025-10-22 20:50:55','2025-10-22 20:50:55'),
(2,'Jane','A','Doe',3,'8325557890',5,'individual',NULL,NULL,NULL,'2025-10-25 02:00:57','2025-10-25 02:00:57'),
(4,'Luffy','D','Monkey',6,NULL,8,'prime',NULL,8,8,'2025-10-25 02:31:35','2025-10-25 02:31:35'),
(5,'Monty',NULL,'Python',7,'1234412341',9,'business',NULL,9,9,'2025-10-25 02:42:49','2025-10-25 02:42:49');

-- Insert sample data for employee
INSERT INTO `employee` VALUES
(1,'Shrek',NULL,'Ogre','clerk',8,'3335551234','1990-05-15',50000.00,'Ogre','123-45-6789',11,NULL,NULL,'2025-10-25 17:56:34','2025-10-25 18:47:36'),
(2,'Theodore',NULL,'Templeton','manager',9,NULL,NULL,1000000.00,NULL,'134-43-3497',12,NULL,NULL,'2025-10-25 19:32:24','2025-10-25 19:32:24');
