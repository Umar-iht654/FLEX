-- MySQL dump 10.19  Distrib 10.3.39-MariaDB, for Linux (x86_64)
--
-- Host: studdb.csc.liv.ac.uk    Database: sgbadede
-- ------------------------------------------------------
-- Server version	10.5.27-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userDetails` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'running',9),(2,'tennis',9),(3,'football',9),(4,'Running',10),(5,'Cycling',10),(6,'Swimming',10),(7,'Yoga',10),(8,'Hiking',10),(9,'Weightlifting',10),(10,'Pilates',10),(11,'Boxing',10),(12,'Rowing',10),(13,'Stretching',10),(14,'Archery',22),(15,'Badminton',22),(16,'Baseball',22),(17,'Basketball',22),(18,'Boxing',22),(19,'Basketball',22),(20,'Cricket',22),(21,'Cycling',22),(22,'Fencing',22),(23,'Golf',22),(24,'Gymnastics',22),(25,'Hockey',22),(26,'Mixed Martial Arts',22),(27,'Rowing',22),(28,'Rugby',22),(29,'Running',22),(30,'Mixed Martial Arts',22),(31,'Skiing',22),(32,'Snowboarding',22),(33,'Swimming',22),(34,'Table Tennis',22),(35,'Tennis',22),(36,'Volleyball',22),(37,'Weight Lifting',22),(38,'Weightlifting',22),(39,'Wrestling',22),(40,'Weight Lifting',22),(41,'Archery',23),(42,'Badminton',23),(43,'Baseball',23),(44,'Basketball',23),(45,'Boxing',23),(46,'Basketball',23),(47,'Cricket',23),(48,'Cycling',23),(49,'Fencing',23),(50,'Golf',23),(51,'Gymnastics',23),(52,'Hockey',23),(53,'Mixed Martial Arts',23),(54,'Rowing',23),(55,'Rugby',23),(56,'Running',23),(57,'Mixed Martial Arts',23),(58,'Skiing',23),(59,'Snowboarding',23),(60,'Swimming',23),(61,'Table Tennis',23),(62,'Tennis',23),(63,'Volleyball',23),(64,'Weight Lifting',23),(65,'Weightlifting',23),(66,'Wrestling',23),(67,'Weight Lifting',23),(68,'Archery',23),(69,'Badminton',23),(70,'Baseball',23),(71,'Basketball',23),(72,'Boxing',23),(73,'Basketball',23),(74,'Cricket',23),(75,'Cycling',23),(76,'Fencing',23),(77,'Golf',23),(78,'Gymnastics',23),(79,'Hockey',23),(80,'Mixed Martial Arts',23),(81,'Rowing',23),(82,'Rugby',23),(83,'Running',23),(84,'Mixed Martial Arts',23),(85,'Skiing',23),(86,'Snowboarding',23),(87,'Swimming',23),(88,'Table Tennis',23),(89,'Tennis',23),(90,'Volleyball',23),(91,'Weight Lifting',23),(92,'Weightlifting',23),(93,'Wrestling',23),(94,'Weight Lifting',23),(95,'running',25),(96,'athletics',25),(97,'snooker',25),(98,'squash',25),(99,'running',26),(100,'racing',26),(101,'gymnastics',26),(102,'racing',28),(103,'darts',28),(104,'watersport',28),(105,'Boxing',29),(106,'Basketball',29),(107,'Volleyball',29),(108,'Weight Lifting',29),(109,'Weight Lifting',29),(110,'Archery',30),(111,'Golf',30),(112,'Gymnastics',30),(113,'Hockey',30),(114,'Mixed Martial Arts',30),(115,'Snowboarding',30),(116,'Badminton',31),(117,'Cricket',31),(118,'Gymnastics',31),(119,'Running',31),(120,'Skiing',31),(121,'Swimming',31),(122,'Volleyball',31),(123,'Archery',32),(124,'Boxing',32),(125,'Cycling',32),(126,'Golf',32),(127,'Gymnastics',32),(128,'Mixed Martial Arts',32),(129,'Running',32),(130,'Badminton',33),(131,'Basketball',33),(132,'Basketball',33),(133,'Cycling',33),(134,'Gymnastics',33),(135,'Boxing',34),(136,'Cycling',34),(137,'Gymnastics',34),(138,'Rowing',34),(139,'Archery',35),(140,'Badminton',35),(141,'Fencing',35),(142,'Archery',37),(143,'Boxing',37),(144,'Cycling',37),(145,'Archery',38),(146,'Cricket',38),(147,'Mixed Martial Arts',38),(148,'Archery',39),(149,'Badminton',39),(150,'Baseball',39);
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friends` (
  `user_username` varchar(255) NOT NULL,
  `friend_username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES ('basits','bob2'),('basits','charlie3'),('basits','diana4'),('basits','edward5'),('basits','fiona6'),('basits','george7'),('basits','hannah8'),('basits','ian9'),('basits','julia10');
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_members` (
  `group_name` varchar(255) NOT NULL,
  `user_username` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'member'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
INSERT INTO `group_members` VALUES ('Cheeky Link','basits','Admin'),('The Prostitutes','BigManSmallSoup','member'),('Sleepy Gang','BigManSmallSoup','member');
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_profile`
--

DROP TABLE IF EXISTS `group_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_profile` (
  `group_name` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `member_count` int(11) NOT NULL AUTO_INCREMENT,
  `activity` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`member_count`),
  UNIQUE KEY `group_name` (`group_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_profile`
--

LOCK TABLES `group_profile` WRITE;
/*!40000 ALTER TABLE `group_profile` DISABLE KEYS */;
INSERT INTO `group_profile` VALUES ('The riot Squad','The riot squad takes the day',1,'Archery'),('The Sleepers','Zzzzzzzzzzzzzzzzzzzzzzzzzzzzz',2,'Baseball'),('The Prostitutes','we bang, we hang, we have a generally good time',3,'Basketball'),('Sleepy Gang','Zzzzzzzzzzzzzzzzzzzzzzzzzzzz',4,'Boxing'),('Cheeky Link','u up boo?',5,'Badminton');
/*!40000 ALTER TABLE `group_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userDetails`
--

DROP TABLE IF EXISTS `userDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userDetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `postcode` varchar(50) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userDetails`
--

LOCK TABLES `userDetails` WRITE;
/*!40000 ALTER TABLE `userDetails` DISABLE KEYS */;
INSERT INTO `userDetails` VALUES (1,'byjbyjjyt jvkygyk','ibuuobioku','biuiuiuyguih','uyviyyvyi','iygiiggi7y','buuuiguiu',NULL,'nkuyvjy@jvjyy.com'),(2,'Bang Babb','Nndshzh','bzbsh','Bangs','Hannah','Mans',NULL,'Hbgg@hbjj.com'),(3,'Bbsb Baghdad','Nsnsbs','bsbsbbs','Unbans','Banana','Bsbsbs',NULL,'Nbsbsb@gnsnb.com'),(4,'Louis Selwood','BigManSmallSoup','fuckyouleon','Littlebourne Road, The Larches','ct3 4af','30/04/2005',NULL,'louisjselwood@gmail.com'),(5,'Bas Add','Bbvvgv','Basit','Bandsman','Men','Jambi',NULL,'Basade@gmail.com'),(6,'Bbb Bbbcg','Bbcc','bcdv','Bbv','Bbv','BBC’s',NULL,'BBC’s@gmail.com'),(7,'Bsbsb Bsbsbs','Bsbsbs','bsbsbsb','Ababa','Urban','Haha',NULL,'Bsbsb@gmail.com'),(8,'Babb Babb','Vvvv','bbvv','Vvvv','Bbvv','Bbbb',NULL,'Bbbb@gmail.com'),(9,'Basit Adedeji','Bbvvghj','Basit2','Bbcbnk','Hbv b','Bananas',NULL,'Basitbriez@gmail.com'),(10,'Basit S','basits','Password123!','1 Main St','L12 ABC','1990-01-01',NULL,'basits@example.com'),(11,'Alice A','alice1','Password123!','2 Oak St','L12 ABC','1992-02-02',NULL,'alice1@example.com'),(12,'Bob B','bob2','Password123!','3 Elm St','L12 ABC','1993-03-03',NULL,'bob2@example.com'),(13,'Charlie C','charlie3','Password123!','4 Pine St','L12 ABC','1994-04-04',NULL,'charlie3@example.com'),(14,'Diana D','diana4','Password123!','5 Maple St','L12 ABC','1995-05-05',NULL,'diana4@example.com'),(15,'Edward E','edward5','Password123!','6 Birch St','L12 ABC','1996-06-06',NULL,'edward5@example.com'),(16,'Fiona F','fiona6','Password123!','7 Cedar St','L12 ABC','1997-07-07',NULL,'fiona6@example.com'),(17,'George G','george7','Password123!','8 Walnut St','L12 ABC','1998-08-08',NULL,'george7@example.com'),(18,'Hannah H','hannah8','Password123!','9 Spruce St','L12 ABC','1999-09-09',NULL,'hannah8@example.com'),(19,'Ian I','ian9','Password123!','10 Fir St','L12 ABC','2000-10-10',NULL,'ian9@example.com'),(20,'Julia J','julia10','Password123!','11 Ash St','L12 ABC','2001-11-11',NULL,'julia10@example.com'),(21,'Louis Selwood','SmallBoyLittleSoup','boyboy','Littlebourne Road, The Larches','ct3 4af','30/04/2005',NULL,'leon@bigman.com'),(22,'Louis Selwood','BigTing','flopper','The Larches, Littlebourne Road','ct3 4af','30/04/2005',NULL,'chabunga@gmail.com'),(23,'Hermes Borapart','Slapper','loco','the streets','L15 4lj','23/12/1844',NULL,'HermsPerms@bigmanenterprises.com'),(24,'dfskdfksldj dlfksdflskdfj','lkdjfskdjflk','sdfsdf','sdfsdfsdfsd','ct3 4af','40/34/25',NULL,'sdlkfjsdfjk@fksdfjsldkf.com'),(25,'leon kiunga','jbekdh','lndkjjf','kbdkudsbd','mbdcbyc','fbfjfkh',NULL,'lkiunga@fjffbh.com'),(26,'osaretin ekhoragbon',' kkkdddj','djbchh',' jj   jjjj','nk kjjj','jkkkjj',NULL,'hhffmd@hhmhj.com'),(27,'hhh bhjbhhb','njddjj','jnjjn','jjnfjfj','jdjffb',' jjfjfj',NULL,'jjjj@vjyvyh.com'),(28,'jhvvy vvttvttv','vyty','ctycvyt','yvyt','vy4d','vvyv',NULL,'vuy@jcyt.com'),(29,'Sebastian Small','sebbysmall','12345','spolltom','f12 4ak','30/04/2005',NULL,'SebSmall@gmail.com'),(30,'Sam Simon','SimonSays','Password123!','sdfsdfsdf','sdfsdfsdf','23/4/23',NULL,'SamSimon@example.com'),(31,'Leon Kyunga','BigManLeon','Password123!','sdfsdfsdfsd','ct3 4af','30/34/503',NULL,'leonrules@example.com'),(32,'stan man','Stanly','1234','hjgfyj','hg6','30/7/04',NULL,'stan@example.com'),(33,'ksdslj sldkfjsd','johnny','12345','sdfklsjfjk','ct34af','30/04/2005',NULL,'john@example.com'),(34,'sdlkfjd sdlkfjs','Adam the man','12345','sdfsdf','ssdfsdf','30/23/4',NULL,'adam@example.com'),(35,'vujyy jbkbj','bukkuu','jvvhk','vvyvyjyj','vhyvy','j,bkbu',NULL,'bkhkh@kgyyj.com'),(36,'fejfdj jndjnffjj','nnjfnfjfn','ndfnfjn','ndfjffn','dfjnfjfn','fjfjfj',NULL,'jjddj@fjfjfj.com'),(37,'m, kl k  kffkfk',' fnfkffn',' k kf fk','nfjjfknwkd','njffnfnd','nffjjfnj',NULL,'fkfkfnfnk@fkmkfkf.com'),(38,'umar omar','ndjj','nfjnjf','knkd','snkjdn','nlcjsku',NULL,'umaromar@example.com'),(39,'John Smith','Gccd','john','Bbcc','Jb','Cvbj',NULL,'Johnny@smith.con');
/*!40000 ALTER TABLE `userDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userProfile`
--

DROP TABLE IF EXISTS `userProfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userProfile` (
  `username` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `notFriend` tinyint(4) DEFAULT NULL,
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userProfile`
--

LOCK TABLES `userProfile` WRITE;
/*!40000 ALTER TABLE `userProfile` DISABLE KEYS */;
INSERT INTO `userProfile` VALUES ('alice1','Loves yoga and mindfulness',NULL,0),('basits','Fitness enthusiast and coder',NULL,NULL),('BigManSmallSoup','What up gang, this is small man with a big soup, coming all the way form the U S of A',NULL,NULL),('bob2','Runner and coffee addict',NULL,0),('charlie3','Cyclist and tech geek',NULL,0),('diana4','Gym rat and smoothie lover',NULL,0),('edward5','Explorer of trails',NULL,0),('fiona6','Morning runner',NULL,0),('Gccd','Johnny of the smithy don ','https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',NULL),('george7','Powerlifter and gamer',NULL,0),('hannah8','Weekend hiker',NULL,0),('ian9','Proud sprinter',NULL,0),('julia10','Cardio queen',NULL,0),('ndjj','i LOOOOVE THE BACKEN CAUSE I\'M A CHICHI MAN','https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',NULL);
/*!40000 ALTER TABLE `userProfile` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-01  1:52:01
