-- MySQL dump 10.13  Distrib 9.5.0, for Win64 (x86_64)
--
-- Host: localhost    Database: crm_practice
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '6d593d94-be05-11f0-9cf8-9c6b00b99192:1-1753';

--
-- Table structure for table `arrival_invoices`
--

DROP TABLE IF EXISTS `arrival_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arrival_invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `numberInvoice` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scanPhoto` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateTimeToWarehouse` date NOT NULL,
  `price` float NOT NULL,
  `vat` tinyint NOT NULL,
  `supplierId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aaedf9efe72f2147a4540bf1aad` (`supplierId`),
  KEY `FK_5813e0bc354265a97baf209639d` (`factoryId`),
  CONSTRAINT `FK_5813e0bc354265a97baf209639d` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_aaedf9efe72f2147a4540bf1aad` FOREIGN KEY (`supplierId`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrival_invoices`
--

LOCK TABLES `arrival_invoices` WRITE;
/*!40000 ALTER TABLE `arrival_invoices` DISABLE KEYS */;
INSERT INTO `arrival_invoices` VALUES (1,'2025-11-11','1','flagRussia.jpg','2025-11-18',500,1,5,1),(2,'2025-11-19','2','flagRussia.jpg','2025-11-19',500,1,5,1);
/*!40000 ALTER TABLE `arrival_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills_components`
--

DROP TABLE IF EXISTS `bills_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentCount` int NOT NULL,
  `price` float NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billId` int DEFAULT NULL,
  `componentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_6459b48a323c38f08195f0b2aa3` (`billId`),
  KEY `FK_12b61924abf9564977d9f70bd4e` (`componentId`),
  CONSTRAINT `FK_12b61924abf9564977d9f70bd4e` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_6459b48a323c38f08195f0b2aa3` FOREIGN KEY (`billId`) REFERENCES `bills_for_pay` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills_components`
--

LOCK TABLES `bills_components` WRITE;
/*!40000 ALTER TABLE `bills_components` DISABLE KEYS */;
/*!40000 ALTER TABLE `bills_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills_for_pay`
--

DROP TABLE IF EXISTS `bills_for_pay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills_for_pay` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `numberBill` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scanPhoto` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expectedSupplyDate` date NOT NULL,
  `totalAmount` float NOT NULL,
  `vat` tinyint NOT NULL,
  `paid` tinyint NOT NULL,
  `link` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplierId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_de2e173a162edb2820e097c741e` (`supplierId`),
  KEY `FK_3a62efbbf9966ebf6a436c2c367` (`factoryId`),
  CONSTRAINT `FK_3a62efbbf9966ebf6a436c2c367` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_de2e173a162edb2820e097c741e` FOREIGN KEY (`supplierId`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills_for_pay`
--

LOCK TABLES `bills_for_pay` WRITE;
/*!40000 ALTER TABLE `bills_for_pay` DISABLE KEYS */;
/*!40000 ALTER TABLE `bills_for_pay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `component_placement_type`
--

DROP TABLE IF EXISTS `component_placement_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component_placement_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `component_placement_type`
--

LOCK TABLES `component_placement_type` WRITE;
/*!40000 ALTER TABLE `component_placement_type` DISABLE KEYS */;
INSERT INTO `component_placement_type` VALUES (1,'Склад');
/*!40000 ALTER TABLE `component_placement_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `component_placements`
--

DROP TABLE IF EXISTS `component_placements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component_placements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `building` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `placementTypeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_33747c66331dd8de217a4597a93` (`placementTypeId`),
  CONSTRAINT `FK_33747c66331dd8de217a4597a93` FOREIGN KEY (`placementTypeId`) REFERENCES `component_placement_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `component_placements`
--

LOCK TABLES `component_placements` WRITE;
/*!40000 ALTER TABLE `component_placements` DISABLE KEYS */;
INSERT INTO `component_placements` VALUES (1,'1','1',1);
/*!40000 ALTER TABLE `component_placements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `components`
--

DROP TABLE IF EXISTS `components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` int DEFAULT NULL,
  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `width` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `thickness` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `material` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receiptDate` date DEFAULT NULL,
  `drawingReference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `placementId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_6f5e42915e617d9f04f0aabead1` (`placementId`),
  KEY `FK_43c61caa88af9dbee090c1684cc` (`parentId`),
  CONSTRAINT `FK_43c61caa88af9dbee090c1684cc` FOREIGN KEY (`parentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_6f5e42915e617d9f04f0aabead1` FOREIGN KEY (`placementId`) REFERENCES `component_placements` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `components`
--

LOCK TABLES `components` WRITE;
/*!40000 ALTER TABLE `components` DISABLE KEYS */;
INSERT INTO `components` VALUES (1,NULL,'Блок питания 15в, 1А','flagRussia.jpg',123,123,123,123,'Стальной','2025-11-18','https://ru.pinterest.com/',1,1),(2,NULL,'Оргстекло 10мм 150х80','flagRussia.jpg',150,80,10,0,'Стальной','2025-11-18','https://ru.pinterest.com/',103,1),(3,NULL,'Оргстекло 6мм 250х50','flagRussia.jpg',250,50,6,0,'Стальной','2025-11-18','https://ru.pinterest.com/',101,1),(4,NULL,'Медный купорос, г','flagRussia.jpg',0,0,0,0,'Стальной','2025-11-18','https://ru.pinterest.com/',597,1),(5,NULL,'Медная полоса толщина 2-3мм, 40х90мм','flagRussia.jpg',40,90,2,0,'Стальной','2025-11-18','https://ru.pinterest.com/',3,1),(6,NULL,'ванна','flagRussia.jpg',0,0,0,0,'Стальной','2025-11-18','https://ru.pinterest.com/',1,1),(7,NULL,'2 электрода','flagRussia.jpg',0,0,0,0,'Стальной','2025-11-18','https://ru.pinterest.com/',0,1),(8,NULL,'Кабель 0.75х1м с одной стороны 2 банана, с другой 2 крокодила','flagRussia.jpg',0,0,0,0,'Стальной','2025-11-18','https://ru.pinterest.com/',1,1),(9,NULL,'Шкурка 1000','flagRussia.jpg',0,0,0,0,'0','2025-11-18','https://ru.pinterest.com/',0,1),(10,NULL,'Детали ванны из оргстекла','flagRussia.jpg',0,0,0,0,'0','2025-11-18','https://ru.pinterest.com/',1,1),(11,NULL,'Кабель 2х0.75, см','flagRussia.jpg',2,0.75,0,0,'Стальной','2025-11-18','https://ru.pinterest.com/',198,1),(12,NULL,'Бананы','flagRussia.jpg',4,0,0,0,'0','2025-11-18','https://ru.pinterest.com/',2,1),(13,NULL,'Крокодилы','flagRussia.jpg',0,0,0,0,'0','2025-11-18','https://ru.pinterest.com/',2,1),(14,NULL,'РЭ электрохимический эквивалент меди','flagRussia.jpg',0,0,0,0,'0','2025-11-18','https://ru.pinterest.com/',1,1),(15,NULL,'Методичка Электрохимический эквивалент меди','flagRussia.jpg',0,0,0,0,'0','2025-11-18','https://ru.pinterest.com/',6,1),(16,NULL,'Стенд электрохимич. ЭМ','flagRussia.jpg',0,0,0,0,'0','2025-11-18','https://ru.pinterest.com/',0,1),(17,NULL,'Бумага А4','flagRussia.jpg',0,0,0,0,'0','2025-11-18','https://ru.pinterest.com/',38,1);
/*!40000 ALTER TABLE `components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_task_states`
--

DROP TABLE IF EXISTS `current_task_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_task_states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e9a260b2c30e9495cc092fac80` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_task_states`
--

LOCK TABLES `current_task_states` WRITE;
/*!40000 ALTER TABLE `current_task_states` DISABLE KEYS */;
INSERT INTO `current_task_states` VALUES (2,'Выполняется'),(3,'Завершена'),(1,'Новая'),(4,'Отменена');
/*!40000 ALTER TABLE `current_task_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_task_states_log`
--

DROP TABLE IF EXISTS `current_task_states_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_task_states_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `currentTaskId` int DEFAULT NULL,
  `currentTaskStateId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_189d127405f0f61924fda7e7c21` (`currentTaskId`),
  KEY `FK_e77974fea916180d6aa9a116be2` (`currentTaskStateId`),
  CONSTRAINT `FK_189d127405f0f61924fda7e7c21` FOREIGN KEY (`currentTaskId`) REFERENCES `current_tasks` (`id`),
  CONSTRAINT `FK_e77974fea916180d6aa9a116be2` FOREIGN KEY (`currentTaskStateId`) REFERENCES `current_task_states` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_task_states_log`
--

LOCK TABLES `current_task_states_log` WRITE;
/*!40000 ALTER TABLE `current_task_states_log` DISABLE KEYS */;
INSERT INTO `current_task_states_log` VALUES (1,'2025-11-18 14:40:59',1,2),(2,'2025-11-18 14:45:37',13,2),(3,'2025-11-18 17:06:58',3,2),(4,'2025-11-19 05:57:39',10,2),(5,'2025-11-19 05:58:53',7,2),(6,'2025-11-19 06:01:06',8,2),(7,'2025-11-19 06:18:30',1,2),(8,'2025-11-19 06:19:03',3,2),(9,'2025-11-19 06:19:08',5,2),(10,'2025-11-19 06:59:53',5,2),(11,'2025-11-19 06:59:58',3,2),(12,'2025-11-19 07:00:56',2,2),(13,'2025-11-19 07:10:03',3,2),(14,'2025-11-19 07:10:03',2,2),(15,'2025-11-19 07:14:43',3,2),(16,'2025-11-19 07:14:43',2,2),(17,'2025-11-19 08:01:57',1,2),(18,'2025-11-19 08:24:31',3,2),(19,'2025-11-19 08:24:31',2,2),(20,'2025-11-19 08:25:24',3,2),(21,'2025-11-19 08:28:26',3,2),(22,'2025-11-19 08:28:47',3,2),(23,'2025-11-19 08:31:00',3,2),(24,'2025-11-19 09:12:36',5,2),(25,'2025-11-19 09:13:55',3,2),(26,'2025-11-19 09:30:10',5,2),(27,'2025-11-19 09:36:26',3,3),(28,'2025-11-19 09:36:34',5,3),(29,'2025-11-19 09:43:29',2,2),(30,'2025-11-19 09:43:36',3,2),(31,'2025-11-19 09:43:40',5,2),(32,'2025-11-19 09:44:24',3,2),(33,'2025-11-19 09:44:50',5,2),(34,'2025-11-19 09:44:55',2,2),(35,'2025-11-19 09:45:04',3,3),(36,'2025-11-19 09:45:07',5,3),(37,'2025-11-19 09:45:09',2,3),(38,'2025-11-19 09:52:19',13,2),(39,'2025-11-19 09:52:24',1,3),(40,'2025-11-19 10:03:56',3,2),(41,'2025-11-19 10:04:03',5,2),(42,'2025-11-19 10:05:09',3,3),(43,'2025-11-19 10:06:35',3,3),(44,'2025-11-19 10:07:14',3,3),(45,'2025-11-19 10:07:46',3,3),(46,'2025-11-19 10:08:22',3,3),(47,'2025-11-19 10:09:40',3,3),(48,'2025-11-19 10:10:02',3,3),(49,'2025-11-19 10:12:30',5,3),(50,'2025-11-19 10:13:21',3,3),(51,'2025-11-19 10:13:29',3,2),(52,'2025-11-19 11:00:18',3,3),(53,'2025-11-19 11:23:42',3,2),(54,'2025-11-19 11:23:45',3,3),(55,'2025-11-19 11:24:08',3,2),(56,'2025-11-19 11:24:12',3,3),(57,'2025-11-19 11:28:01',3,3),(58,'2025-11-19 11:32:30',3,3),(59,'2025-11-19 11:35:12',7,2),(60,'2025-11-19 11:35:19',8,2),(61,'2025-11-19 11:35:38',7,3),(62,'2025-11-19 11:35:42',8,3),(63,'2025-11-19 11:55:55',3,2),(64,'2025-11-19 11:56:01',5,2),(65,'2025-11-19 11:56:08',3,3),(66,'2025-11-19 11:56:13',5,3),(67,'2025-11-19 12:04:22',4,2),(68,'2025-11-19 12:04:31',4,3),(69,'2025-11-19 12:05:24',4,3),(70,'2025-11-19 12:06:34',6,2),(71,'2025-11-19 12:06:40',6,3),(72,'2025-11-19 12:18:25',6,2),(73,'2025-11-19 12:18:33',6,3),(74,'2025-11-19 12:23:46',6,2),(75,'2025-11-19 12:23:50',6,3),(76,'2025-11-19 12:24:31',6,2),(77,'2025-11-19 12:24:45',6,3),(78,'2025-11-19 12:26:41',6,2),(79,'2025-11-19 12:26:45',6,3),(80,'2025-11-19 12:31:14',6,2),(81,'2025-11-19 12:31:17',6,3),(82,'2025-11-19 12:31:49',10,2),(83,'2025-11-19 12:32:05',10,3),(84,'2025-11-19 12:32:58',12,2),(85,'2025-11-19 12:33:06',12,3),(86,'2025-11-19 12:33:50',12,3),(87,'2025-11-19 12:40:26',12,2),(88,'2025-11-19 12:40:56',12,3),(89,'2025-11-19 12:44:45',12,2),(90,'2025-11-19 12:44:48',12,3),(91,'2025-11-19 12:47:29',12,2),(92,'2025-11-19 12:47:31',12,3),(93,'2025-11-19 12:47:55',13,2),(94,'2025-11-19 12:47:57',13,3),(95,'2025-11-19 12:49:17',12,2),(96,'2025-11-19 12:49:22',12,3),(97,'2025-11-19 12:49:45',13,2),(98,'2025-11-19 12:50:06',13,3),(99,'2025-11-19 12:55:34',12,2),(100,'2025-11-19 12:55:37',12,3),(101,'2025-11-19 13:02:15',12,2),(102,'2025-11-19 13:02:20',12,3),(103,'2025-11-19 13:08:24',12,2),(104,'2025-11-19 13:08:29',12,3),(105,'2025-11-19 13:20:55',12,2),(106,'2025-11-19 13:24:48',12,3),(107,'2025-11-19 13:27:13',12,2),(108,'2025-11-19 13:27:19',12,3),(109,'2025-11-19 13:35:49',3,2),(110,'2025-11-19 13:36:20',5,2),(111,'2025-11-19 13:48:48',5,2),(112,'2025-11-19 13:49:13',3,2),(113,'2025-11-19 13:49:46',3,2),(114,'2025-11-19 13:50:07',3,3),(115,'2025-11-19 13:50:27',2,3),(116,'2025-11-19 13:50:32',5,3);
/*!40000 ALTER TABLE `current_task_states_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_tasks`
--

DROP TABLE IF EXISTS `current_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` int DEFAULT NULL,
  `isCompleted` tinyint NOT NULL DEFAULT '0',
  `currentTaskStateId` int DEFAULT NULL,
  `standTaskId` int DEFAULT NULL,
  `executorId` int DEFAULT NULL,
  `shipmentStandId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ac93b4ed7ed329475addd702764` (`currentTaskStateId`),
  KEY `FK_323e3b7560efaabd53b5842e488` (`standTaskId`),
  KEY `FK_8521a6d4cb1aaddb297f4572d77` (`executorId`),
  KEY `FK_7bdc4779ca917349b0fa021a753` (`shipmentStandId`),
  CONSTRAINT `FK_323e3b7560efaabd53b5842e488` FOREIGN KEY (`standTaskId`) REFERENCES `stand_tasks` (`id`),
  CONSTRAINT `FK_7bdc4779ca917349b0fa021a753` FOREIGN KEY (`shipmentStandId`) REFERENCES `shipments_stands` (`id`),
  CONSTRAINT `FK_8521a6d4cb1aaddb297f4572d77` FOREIGN KEY (`executorId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_ac93b4ed7ed329475addd702764` FOREIGN KEY (`currentTaskStateId`) REFERENCES `current_task_states` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_tasks`
--

LOCK TABLES `current_tasks` WRITE;
/*!40000 ALTER TABLE `current_tasks` DISABLE KEYS */;
INSERT INTO `current_tasks` VALUES (1,NULL,0,1,1,NULL,1),(2,NULL,0,1,3,NULL,1),(3,3,1,3,4,8,1),(4,3,0,1,5,NULL,1),(5,3,1,3,6,4,1),(6,3,0,1,7,NULL,1),(7,3,0,1,8,NULL,1),(8,3,0,1,9,NULL,1),(9,NULL,0,1,10,NULL,1),(10,10,0,1,11,NULL,1),(11,NULL,0,1,12,NULL,1),(12,12,0,1,13,NULL,1),(13,NULL,0,1,14,NULL,1);
/*!40000 ALTER TABLE `current_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_tasks_components`
--

DROP TABLE IF EXISTS `current_tasks_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_tasks_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentCount` int NOT NULL,
  `warehouseComponentCount` int NOT NULL,
  `currentTaskId` int DEFAULT NULL,
  `componentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a3a50029c19ed013abfca3e4ce8` (`currentTaskId`),
  KEY `FK_193e2ec3bf6ad89ec8883bd9c50` (`componentId`),
  CONSTRAINT `FK_193e2ec3bf6ad89ec8883bd9c50` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_a3a50029c19ed013abfca3e4ce8` FOREIGN KEY (`currentTaskId`) REFERENCES `current_tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_tasks_components`
--

LOCK TABLES `current_tasks_components` WRITE;
/*!40000 ALTER TABLE `current_tasks_components` DISABLE KEYS */;
/*!40000 ALTER TABLE `current_tasks_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Производство'),(2,'Штаб'),(3,'Логистика');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_departments`
--

DROP TABLE IF EXISTS `employee_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `departmentId` int DEFAULT NULL,
  `employeeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d514712ac27e17a6b3e2fb3cd6f` (`departmentId`),
  KEY `FK_35bd4eb56c8462bf27244ab2547` (`employeeId`),
  CONSTRAINT `FK_35bd4eb56c8462bf27244ab2547` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_d514712ac27e17a6b3e2fb3cd6f` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_departments`
--

LOCK TABLES `employee_departments` WRITE;
/*!40000 ALTER TABLE `employee_departments` DISABLE KEYS */;
INSERT INTO `employee_departments` VALUES (1,1,2),(2,3,3),(3,1,4),(4,1,5),(5,1,6),(6,1,7),(7,1,8);
/*!40000 ALTER TABLE `employee_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hiringDate` date DEFAULT NULL,
  `dismissalDate` date DEFAULT NULL,
  `peopleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_67ea77e706eb0d21e650a8c919f` (`peopleId`),
  CONSTRAINT `FK_67ea77e706eb0d21e650a8c919f` FOREIGN KEY (`peopleId`) REFERENCES `peoples` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,NULL,NULL,1),(2,'2025-11-03',NULL,2),(3,'2025-08-04',NULL,3),(4,'2013-03-04',NULL,4),(5,NULL,NULL,5),(6,'2023-05-02',NULL,6),(7,'2025-11-19',NULL,7),(8,'2025-11-04',NULL,8);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees_professions`
--

DROP TABLE IF EXISTS `employees_professions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees_professions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeId` int DEFAULT NULL,
  `professionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2498675ae18ffc015e1ce571552` (`employeeId`),
  KEY `FK_3d653d0b2d41ff7f9682c2df4c9` (`professionId`),
  CONSTRAINT `FK_2498675ae18ffc015e1ce571552` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_3d653d0b2d41ff7f9682c2df4c9` FOREIGN KEY (`professionId`) REFERENCES `professions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees_professions`
--

LOCK TABLES `employees_professions` WRITE;
/*!40000 ALTER TABLE `employees_professions` DISABLE KEYS */;
INSERT INTO `employees_professions` VALUES (1,1,1),(2,2,4),(3,3,5),(4,4,12),(5,5,9),(6,6,10),(7,7,19),(8,8,12);
/*!40000 ALTER TABLE `employees_professions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees_vacations`
--

DROP TABLE IF EXISTS `employees_vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees_vacations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `employeeId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_34aee87775ac3312d2920530141` (`employeeId`),
  KEY `FK_63ec50ea276cb28f36dfa7bc8f1` (`factoryId`),
  CONSTRAINT `FK_34aee87775ac3312d2920530141` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_63ec50ea276cb28f36dfa7bc8f1` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees_vacations`
--

LOCK TABLES `employees_vacations` WRITE;
/*!40000 ALTER TABLE `employees_vacations` DISABLE KEYS */;
/*!40000 ALTER TABLE `employees_vacations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `originalName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mimetype` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `targetType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,'file-1763467116858-821590820.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467116858-821590820.jpg',NULL,'2025-11-18 16:58:36.861886','stands',1),(2,'file-1763467313737-437241864.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467313737-437241864.jpg',NULL,'2025-11-18 17:01:53.739938','stand_tasks',1),(3,'file-1763467494535-851893354.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467494535-851893354.jpg',NULL,'2025-11-18 17:04:54.538757','components',1),(4,'file-1763467679834-157895400.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467679834-157895400.jpg',NULL,'2025-11-18 17:07:59.836652','components',2),(5,'file-1763467733830-145185452.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467733830-145185452.jpg',NULL,'2025-11-18 17:08:53.832153','components',3),(6,'file-1763467765997-815184697.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467765997-815184697.jpg',NULL,'2025-11-18 17:09:25.999593','components',4),(7,'file-1763467807847-583369419.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467807847-583369419.jpg',NULL,'2025-11-18 17:10:07.849522','components',5),(8,'file-1763467824646-35776412.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467824646-35776412.jpg',NULL,'2025-11-18 17:10:24.649022','components',6),(9,'file-1763467846976-840480243.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467846976-840480243.jpg',NULL,'2025-11-18 17:10:46.979243','components',7),(10,'file-1763467909105-506754801.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467909105-506754801.jpg',NULL,'2025-11-18 17:11:49.108777','components',8),(11,'file-1763467981145-640572305.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763467981145-640572305.jpg',NULL,'2025-11-18 17:13:01.147931','components',9),(12,'file-1763468002867-927869417.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468002867-927869417.jpg',NULL,'2025-11-18 17:13:22.869888','components',10),(13,'file-1763468036140-356771837.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468036140-356771837.jpg',NULL,'2025-11-18 17:13:56.143185','components',11),(14,'file-1763468060266-259182329.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468060266-259182329.jpg',NULL,'2025-11-18 17:14:20.269462','components',12),(15,'file-1763468098910-380774554.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468098910-380774554.jpg',NULL,'2025-11-18 17:14:58.912753','components',13),(16,'file-1763468121997-163935666.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468121997-163935666.jpg',NULL,'2025-11-18 17:15:22.000203','components',14),(17,'file-1763468147300-703677414.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468147300-703677414.jpg',NULL,'2025-11-18 17:15:47.303359','components',15),(18,'file-1763468166342-868702086.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468166342-868702086.jpg',NULL,'2025-11-18 17:16:06.345124','components',16),(19,'file-1763468213998-288233654.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468213998-288233654.jpg',NULL,'2025-11-18 17:16:54.000752','components',17),(20,'file-1763468523939-855010426.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763468523939-855010426.jpg',NULL,'2025-11-18 17:22:03.942343','arrival_invoices',1),(21,'file-1763471952634-476639499.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763471952634-476639499.jpg',NULL,'2025-11-18 18:19:12.636515','stand_tasks',3),(22,'file-1763472141657-581807042.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763472141657-581807042.jpg',NULL,'2025-11-18 18:22:21.659557','stand_tasks',4),(23,'file-1763472703255-128633237.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763472703255-128633237.jpg',NULL,'2025-11-18 18:31:43.257649','stand_tasks',5),(24,'file-1763472790641-604873321.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763472790641-604873321.jpg',NULL,'2025-11-18 18:33:10.643572','stand_tasks',6),(25,'file-1763473088798-527247731.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473088798-527247731.jpg',NULL,'2025-11-18 18:38:08.802686','stand_tasks',7),(26,'file-1763473287787-180114286.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473287787-180114286.jpg',NULL,'2025-11-18 18:41:27.790609','stand_tasks',8),(27,'file-1763473358342-973780789.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473358342-973780789.jpg',NULL,'2025-11-18 18:42:38.360421','stand_tasks',9),(28,'file-1763473489115-881464865.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473489115-881464865.jpg',NULL,'2025-11-18 18:44:49.123355','stand_tasks',10),(29,'file-1763473522120-800665000.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473522120-800665000.jpg',NULL,'2025-11-18 18:45:22.140140','stand_tasks',11),(30,'file-1763473616180-635474987.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473616180-635474987.jpg',NULL,'2025-11-18 18:46:56.182337','stand_tasks',12),(31,'file-1763473648972-360086226.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473648972-360086226.jpg',NULL,'2025-11-18 18:47:28.974110','stand_tasks',13),(32,'file-1763473777199-433797189.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473777199-433797189.jpg',NULL,'2025-11-18 18:49:37.201528','stand_tasks',14),(33,'file-1763473928741-813189851.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763473928741-813189851.jpg',NULL,'2025-11-18 18:52:08.743611','shipments',1),(34,'file-1763551915854-701132742.jpg','flagRussia.jpg','image/jpeg',563919,'uploads/file-1763551915854-701132742.jpg',NULL,'2025-11-19 16:31:55.859663','arrival_invoices',2);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventarization`
--

DROP TABLE IF EXISTS `inventarization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventarization` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventarizationDate` date NOT NULL,
  `componentCount` int NOT NULL,
  `inventarizationQuality` int NOT NULL,
  `componentId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_940d8e29fcec5cda77fbabe3358` (`componentId`),
  KEY `FK_50a79b3a58b3ec709c14f41c22e` (`factoryId`),
  CONSTRAINT `FK_50a79b3a58b3ec709c14f41c22e` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_940d8e29fcec5cda77fbabe3358` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventarization`
--

LOCK TABLES `inventarization` WRITE;
/*!40000 ALTER TABLE `inventarization` DISABLE KEYS */;
INSERT INTO `inventarization` VALUES (1,'2025-11-19',0,100,1,1),(2,'2025-11-19',103,100,2,1),(3,'2025-11-19',101,100,3,1),(4,'2025-11-19',597,100,4,1),(5,'2025-11-19',3,100,5,1),(6,'2025-11-19',198,100,11,1),(7,'2025-11-19',2,100,12,1),(8,'2025-11-19',2,100,13,1),(9,'2025-11-19',1,100,10,1),(10,'2025-11-19',0,100,6,1),(11,'2025-11-19',0,100,8,1),(12,'2025-11-19',0,100,14,1),(13,'2025-11-19',6,100,15,1),(14,'2025-11-19',0,100,16,1),(15,'2025-11-19',38,100,17,1),(16,'2025-11-19',0,100,6,1),(17,'2025-11-19',0,100,8,1),(18,'2025-11-19',0,100,1,1),(19,'2025-11-19',0,100,14,1),(20,'2025-11-19',0,100,16,1),(21,'2025-11-19',0,100,6,1),(22,'2025-11-19',0,100,8,1),(23,'2025-11-19',0,100,1,1),(24,'2025-11-19',0,100,14,1),(25,'2025-11-19',0,100,6,1),(26,'2025-11-19',0,100,8,1),(27,'2025-11-19',0,100,1,1),(28,'2025-11-19',0,100,14,1),(29,'2025-11-19',0,100,6,1),(30,'2025-11-19',0,100,8,1),(31,'2025-11-19',0,100,1,1),(32,'2025-11-19',0,100,14,1),(33,'2025-11-19',2,100,6,1),(34,'2025-11-19',2,100,8,1),(35,'2025-11-19',2,100,1,1),(36,'2025-11-19',2,100,14,1),(37,'2025-11-19',1,100,6,1),(38,'2025-11-19',1,100,8,1),(39,'2025-11-19',1,100,1,1),(40,'2025-11-19',1,100,14,1),(41,'2025-11-19',1,100,6,1),(42,'2025-11-19',1,100,8,1),(43,'2025-11-19',1,100,1,1),(44,'2025-11-19',1,100,14,1);
/*!40000 ALTER TABLE `inventarization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices_components`
--

DROP TABLE IF EXISTS `invoices_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentCount` int NOT NULL,
  `arrivalInvoiceId` int DEFAULT NULL,
  `componentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_55ae912bbd309fc2d014a7566bb` (`arrivalInvoiceId`),
  KEY `FK_7581400fd7d02956c62f7da713e` (`componentId`),
  CONSTRAINT `FK_55ae912bbd309fc2d014a7566bb` FOREIGN KEY (`arrivalInvoiceId`) REFERENCES `arrival_invoices` (`id`),
  CONSTRAINT `FK_7581400fd7d02956c62f7da713e` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices_components`
--

LOCK TABLES `invoices_components` WRITE;
/*!40000 ALTER TABLE `invoices_components` DISABLE KEYS */;
INSERT INTO `invoices_components` VALUES (1,3,1,1),(2,4,1,2),(3,2,1,3),(4,600,1,4),(5,4,1,5),(6,200,1,11),(7,4,1,12),(8,4,1,13),(9,1,1,10),(10,2,1,6),(11,2,1,8),(12,1,1,14),(13,2,1,15),(14,1,1,16),(15,40,1,17),(16,100,2,2),(17,100,2,3),(18,1,2,10),(19,1,2,6),(20,1,2,8),(21,1,2,1),(22,1,2,14),(23,5,2,15);
/*!40000 ALTER TABLE `invoices_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license`
--

DROP TABLE IF EXISTS `license`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `license` (
  `id` int NOT NULL AUTO_INCREMENT,
  `licenseCode` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  `places` int NOT NULL,
  `timeout` time DEFAULT NULL,
  `comment` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenseTypeId` int DEFAULT NULL,
  `standId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_49f7e8d9f5dbfe6cd5cacf4ca01` (`licenseTypeId`),
  KEY `FK_518b260778a450eb6c446c7bb53` (`standId`),
  CONSTRAINT `FK_49f7e8d9f5dbfe6cd5cacf4ca01` FOREIGN KEY (`licenseTypeId`) REFERENCES `license_types` (`id`),
  CONSTRAINT `FK_518b260778a450eb6c446c7bb53` FOREIGN KEY (`standId`) REFERENCES `stands` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license`
--

LOCK TABLES `license` WRITE;
/*!40000 ALTER TABLE `license` DISABLE KEYS */;
INSERT INTO `license` VALUES (1,'STND123','2025-12-01','2026-11-30',1000,'02:00:00',NULL,1,1);
/*!40000 ALTER TABLE `license` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license_types`
--

DROP TABLE IF EXISTS `license_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `license_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license_types`
--

LOCK TABLES `license_types` WRITE;
/*!40000 ALTER TABLE `license_types` DISABLE KEYS */;
INSERT INTO `license_types` VALUES (1,'Стандартная');
/*!40000 ALTER TABLE `license_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_requests`
--

DROP TABLE IF EXISTS `order_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requestDatetime` date NOT NULL,
  `executionDatetime` date NOT NULL,
  `comment` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  `standId` int DEFAULT NULL,
  `employeeCreatorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d9b4e4048ac0ce30e8462ceb203` (`factoryId`),
  KEY `FK_8abbd0c0001dbb763e7eb735678` (`standId`),
  KEY `FK_08182720058a37e2b6cfd62811d` (`employeeCreatorId`),
  CONSTRAINT `FK_08182720058a37e2b6cfd62811d` FOREIGN KEY (`employeeCreatorId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_8abbd0c0001dbb763e7eb735678` FOREIGN KEY (`standId`) REFERENCES `stands` (`id`),
  CONSTRAINT `FK_d9b4e4048ac0ce30e8462ceb203` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_requests`
--

LOCK TABLES `order_requests` WRITE;
/*!40000 ALTER TABLE `order_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_requests_components`
--

DROP TABLE IF EXISTS `order_requests_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_requests_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentCount` int NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderRequestId` int DEFAULT NULL,
  `componentId` int DEFAULT NULL,
  `supplierId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_44cb4b1ae4ad376261cdb1de45d` (`orderRequestId`),
  KEY `FK_c2c649edd4c21ad3f01a254951e` (`componentId`),
  KEY `FK_ccac18f35c0274a8cf3246f76b6` (`supplierId`),
  CONSTRAINT `FK_44cb4b1ae4ad376261cdb1de45d` FOREIGN KEY (`orderRequestId`) REFERENCES `order_requests` (`id`),
  CONSTRAINT `FK_c2c649edd4c21ad3f01a254951e` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_ccac18f35c0274a8cf3246f76b6` FOREIGN KEY (`supplierId`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_requests_components`
--

LOCK TABLES `order_requests_components` WRITE;
/*!40000 ALTER TABLE `order_requests_components` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_requests_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization_types`
--

DROP TABLE IF EXISTS `organization_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_59146578051c2b6fedd252a2da` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization_types`
--

LOCK TABLES `organization_types` WRITE;
/*!40000 ALTER TABLE `organization_types` DISABLE KEYS */;
INSERT INTO `organization_types` VALUES (1,NULL,'Фабрика'),(2,NULL,'Перевозчик'),(3,NULL,'Производитель'),(4,NULL,'Клиент'),(5,NULL,'Поставщик');
/*!40000 ALTER TABLE `organization_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` int DEFAULT NULL,
  `fullName` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortName` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lawAddress` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `factAddress` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postAddress` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `inn` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kpp` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orgn` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orgnDate` date NOT NULL,
  `phone` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `digitalDocs` tinyint NOT NULL,
  `rating` float NOT NULL,
  `comment` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPeopleId` int DEFAULT NULL,
  `organizationTypeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_25d4d749cb8b89da9bc824a6e21` (`contactPeopleId`),
  KEY `FK_6aaf0d2cd7b4aed92db7afed9f7` (`organizationTypeId`),
  CONSTRAINT `FK_25d4d749cb8b89da9bc824a6e21` FOREIGN KEY (`contactPeopleId`) REFERENCES `peoples` (`id`),
  CONSTRAINT `FK_6aaf0d2cd7b4aed92db7afed9f7` FOREIGN KEY (`organizationTypeId`) REFERENCES `organization_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,NULL,'ООО Фабрика','Фабрика','фыв','фыв','фыв','123','123','123','2025-11-18','123','123',1,99,NULL,1,1),(2,NULL,'ООО Перевозчик','Перевозищщщщщщее','123','123','123','123','123','123','2025-11-18','123','123',1,123,NULL,1,2),(3,NULL,'ООО Производитель','Производищщще','123','123','123','123','123','123','2025-11-18','123','123',1,123,NULL,1,3),(4,NULL,'ООО Клиент','Клиентищщщщщщеее','123','123','123','123','123','123','2025-11-18','123','123',1,123,'123',1,4),(5,NULL,'ООО Поставщик','Поставщищщще','123','123','123','123','123','123','2025-11-18','123','123',1,123,'123',1,5);
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pcb_order_states`
--

DROP TABLE IF EXISTS `pcb_order_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pcb_order_states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_bd41af9c78de995743c5f9afc6` (`state`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pcb_order_states`
--

LOCK TABLES `pcb_order_states` WRITE;
/*!40000 ALTER TABLE `pcb_order_states` DISABLE KEYS */;
INSERT INTO `pcb_order_states` VALUES (2,'Не оплачен'),(1,'Новый'),(3,'Оплачен'),(4,'Отменен');
/*!40000 ALTER TABLE `pcb_order_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pcb_orders`
--

DROP TABLE IF EXISTS `pcb_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pcb_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderDate` date NOT NULL,
  `billNumber` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL,
  `width` float NOT NULL,
  `height` float NOT NULL,
  `thickness` float NOT NULL,
  `article` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` float NOT NULL,
  `pcbId` int DEFAULT NULL,
  `pcbManufacturerId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  `employeeId` int DEFAULT NULL,
  `pcbOrderStatusId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b15bc2aef1391ba1f83e666868b` (`pcbId`),
  KEY `FK_77b3c8cf995a59d844984bfa205` (`pcbManufacturerId`),
  KEY `FK_29887b1a7c1672f9a6f6006fd5c` (`factoryId`),
  KEY `FK_10de2fb4f50adc49afa89fe76f1` (`employeeId`),
  KEY `FK_69948ee84a38ec765ef6d71a234` (`pcbOrderStatusId`),
  CONSTRAINT `FK_10de2fb4f50adc49afa89fe76f1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_29887b1a7c1672f9a6f6006fd5c` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_69948ee84a38ec765ef6d71a234` FOREIGN KEY (`pcbOrderStatusId`) REFERENCES `pcb_order_states` (`id`),
  CONSTRAINT `FK_77b3c8cf995a59d844984bfa205` FOREIGN KEY (`pcbManufacturerId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_b15bc2aef1391ba1f83e666868b` FOREIGN KEY (`pcbId`) REFERENCES `pcbs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pcb_orders`
--

LOCK TABLES `pcb_orders` WRITE;
/*!40000 ALTER TABLE `pcb_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `pcb_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pcbs`
--

DROP TABLE IF EXISTS `pcbs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pcbs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` int DEFAULT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `standId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_03bcf62b9ba6be0d0cf6fd04478` (`standId`),
  KEY `FK_732ebbbfd68dcba1dae4b138916` (`parentId`),
  CONSTRAINT `FK_03bcf62b9ba6be0d0cf6fd04478` FOREIGN KEY (`standId`) REFERENCES `stands` (`id`),
  CONSTRAINT `FK_732ebbbfd68dcba1dae4b138916` FOREIGN KEY (`parentId`) REFERENCES `pcbs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pcbs`
--

LOCK TABLES `pcbs` WRITE;
/*!40000 ALTER TABLE `pcbs` DISABLE KEYS */;
/*!40000 ALTER TABLE `pcbs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pcbs_components`
--

DROP TABLE IF EXISTS `pcbs_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pcbs_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentCount` int NOT NULL,
  `pcbId` int DEFAULT NULL,
  `componentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_691097a2e830957711817c085ef` (`pcbId`),
  KEY `FK_681cdc49a4769ae1debcb9650c3` (`componentId`),
  CONSTRAINT `FK_681cdc49a4769ae1debcb9650c3` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_691097a2e830957711817c085ef` FOREIGN KEY (`pcbId`) REFERENCES `pcbs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pcbs_components`
--

LOCK TABLES `pcbs_components` WRITE;
/*!40000 ALTER TABLE `pcbs_components` DISABLE KEYS */;
/*!40000 ALTER TABLE `pcbs_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peoples`
--

DROP TABLE IF EXISTS `peoples`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peoples` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `middleName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peoples`
--

LOCK TABLES `peoples` WRITE;
/*!40000 ALTER TABLE `peoples` DISABLE KEYS */;
INSERT INTO `peoples` VALUES (1,'admin','admin','admin','+79999999999','info@apracticum.ru','Супер администратор системы','1999-11-30'),(2,'Заведующий','Отделением','Прокопов','8797979789','petr@mail.ru',NULL,'2025-08-12'),(3,'Вера','Вячеславовна','Сивцова','85943859358','vera@mail.ru',NULL,'2025-04-21'),(4,'Игорь','Валерьевич','Мысов','8987987979','igor@mail.ru',NULL,'2025-06-17'),(5,'Вера','Вячеславовна','Сивцова','879797999879','vera@mail.ru',NULL,'2025-07-14'),(6,'Андрей','Николаевич','Кисель','89854365486','kisel@mail.ru',NULL,'1988-08-31'),(7,'Химик','Химик','Химик','89797979789','khimik@mail.ru',NULL,'2025-08-19'),(8,'токарь','токарь','токарь','12312321','bekarev.ps@gmail.com',NULL,'2025-10-13');
/*!40000 ALTER TABLE `peoples` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professions`
--

DROP TABLE IF EXISTS `professions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professions`
--

LOCK TABLES `professions` WRITE;
/*!40000 ALTER TABLE `professions` DISABLE KEYS */;
INSERT INTO `professions` VALUES (1,'Администратор'),(2,'Директор'),(3,'Бухгалтер'),(4,'Зав. производством'),(5,'Снабженец'),(6,'Программист'),(7,'Дизайнер'),(8,'Конструктор'),(9,'Инженер'),(10,'Монтажник'),(11,'Слесарь'),(12,'Токарь'),(13,'Фрезеровщик'),(14,'Сварщик'),(15,'Столяр'),(16,'Технолог ПП'),(17,'Покрасчик'),(18,'Test'),(19,'Химик');
/*!40000 ALTER TABLE `professions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server_arrivals`
--

DROP TABLE IF EXISTS `server_arrivals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `server_arrivals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dateTime` date NOT NULL,
  `componentCount` int NOT NULL,
  `componentId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  `currentTaskId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_888a50581e476f99b95e4f96248` (`componentId`),
  KEY `FK_bbd8a0abcd82cede668e096debc` (`factoryId`),
  KEY `FK_88943c10b8f0f624f9ccb162d61` (`currentTaskId`),
  CONSTRAINT `FK_888a50581e476f99b95e4f96248` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_88943c10b8f0f624f9ccb162d61` FOREIGN KEY (`currentTaskId`) REFERENCES `current_tasks` (`id`),
  CONSTRAINT `FK_bbd8a0abcd82cede668e096debc` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server_arrivals`
--

LOCK TABLES `server_arrivals` WRITE;
/*!40000 ALTER TABLE `server_arrivals` DISABLE KEYS */;
/*!40000 ALTER TABLE `server_arrivals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server_writeoff`
--

DROP TABLE IF EXISTS `server_writeoff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `server_writeoff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dateTime` date NOT NULL,
  `componentCount` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `componentId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  `currentTaskId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2e0b92654fcf930d4e58082e867` (`componentId`),
  KEY `FK_04845c3e87fbe656183d4db12ed` (`factoryId`),
  KEY `FK_94eafb45cce5004bce814ba2724` (`currentTaskId`),
  CONSTRAINT `FK_04845c3e87fbe656183d4db12ed` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_2e0b92654fcf930d4e58082e867` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_94eafb45cce5004bce814ba2724` FOREIGN KEY (`currentTaskId`) REFERENCES `current_tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server_writeoff`
--

LOCK TABLES `server_writeoff` WRITE;
/*!40000 ALTER TABLE `server_writeoff` DISABLE KEYS */;
/*!40000 ALTER TABLE `server_writeoff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipment_package`
--

DROP TABLE IF EXISTS `shipment_package`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipment_package` (
  `id` int NOT NULL AUTO_INCREMENT,
  `width` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `height` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thickness` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stateId` int DEFAULT NULL,
  `shipmentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a398d563741fee5a21f6c770092` (`stateId`),
  KEY `FK_0a8aa4c984d5f834a2bf5ea4d58` (`shipmentId`),
  CONSTRAINT `FK_0a8aa4c984d5f834a2bf5ea4d58` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`),
  CONSTRAINT `FK_a398d563741fee5a21f6c770092` FOREIGN KEY (`stateId`) REFERENCES `shipment_package_states` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipment_package`
--

LOCK TABLES `shipment_package` WRITE;
/*!40000 ALTER TABLE `shipment_package` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipment_package` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipment_package_states`
--

DROP TABLE IF EXISTS `shipment_package_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipment_package_states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipment_package_states`
--

LOCK TABLES `shipment_package_states` WRITE;
/*!40000 ALTER TABLE `shipment_package_states` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipment_package_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipment_trips`
--

DROP TABLE IF EXISTS `shipment_trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipment_trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tripStartDate` date NOT NULL,
  `tripEndDate` date NOT NULL,
  `shipmentId` int DEFAULT NULL,
  `employeeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d6bd80aa01b41e36d34f0c5cd46` (`shipmentId`),
  KEY `FK_6b99db67347451860dc76d48914` (`employeeId`),
  CONSTRAINT `FK_6b99db67347451860dc76d48914` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_d6bd80aa01b41e36d34f0c5cd46` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipment_trips`
--

LOCK TABLES `shipment_trips` WRITE;
/*!40000 ALTER TABLE `shipment_trips` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipment_trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipments`
--

DROP TABLE IF EXISTS `shipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `addedDate` date NOT NULL,
  `shipmentDate` date NOT NULL,
  `arrivalDate` date NOT NULL,
  `specificationImage` json DEFAULT NULL,
  `comment` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenseId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  `transporterId` int DEFAULT NULL,
  `clientId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_ecf0b68b122a10eecdf20d35d1` (`licenseId`),
  KEY `FK_433d19666bc4a0f98faeefd9856` (`factoryId`),
  KEY `FK_be5a5c0b40e5744a78e130ea81e` (`transporterId`),
  KEY `FK_ac32e989bba954a3ab561f2467e` (`clientId`),
  CONSTRAINT `FK_433d19666bc4a0f98faeefd9856` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_ac32e989bba954a3ab561f2467e` FOREIGN KEY (`clientId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_be5a5c0b40e5744a78e130ea81e` FOREIGN KEY (`transporterId`) REFERENCES `organizations` (`id`),
  CONSTRAINT `FK_ecf0b68b122a10eecdf20d35d1a` FOREIGN KEY (`licenseId`) REFERENCES `license` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipments`
--

LOCK TABLES `shipments` WRITE;
/*!40000 ALTER TABLE `shipments` DISABLE KEYS */;
INSERT INTO `shipments` VALUES (1,900,'2025-11-01','2025-11-21','2025-11-24','[\"flagRussia.jpg\"]',NULL,1,1,2,4);
/*!40000 ALTER TABLE `shipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipments_stands`
--

DROP TABLE IF EXISTS `shipments_stands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipments_stands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipmentId` int DEFAULT NULL,
  `standId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_9c5ba5fe2333b5d5abde7dfdb6f` (`shipmentId`),
  KEY `FK_85e42dac882ef345368781c13ca` (`standId`),
  CONSTRAINT `FK_85e42dac882ef345368781c13ca` FOREIGN KEY (`standId`) REFERENCES `stands` (`id`),
  CONSTRAINT `FK_9c5ba5fe2333b5d5abde7dfdb6f` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipments_stands`
--

LOCK TABLES `shipments_stands` WRITE;
/*!40000 ALTER TABLE `shipments_stands` DISABLE KEYS */;
INSERT INTO `shipments_stands` VALUES (1,1,1);
/*!40000 ALTER TABLE `shipments_stands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stand_packages`
--

DROP TABLE IF EXISTS `stand_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stand_packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `width` float NOT NULL,
  `height` float NOT NULL,
  `thickness` float NOT NULL,
  `weight` float NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `standId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4ebcf124f732edae5587f960eb5` (`standId`),
  CONSTRAINT `FK_4ebcf124f732edae5587f960eb5` FOREIGN KEY (`standId`) REFERENCES `stands` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stand_packages`
--

LOCK TABLES `stand_packages` WRITE;
/*!40000 ALTER TABLE `stand_packages` DISABLE KEYS */;
/*!40000 ALTER TABLE `stand_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stand_tasks`
--

DROP TABLE IF EXISTS `stand_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stand_tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` int DEFAULT NULL,
  `order` int NOT NULL,
  `componentOutCount` int DEFAULT NULL,
  `manufactureTime` int NOT NULL,
  `standId` int DEFAULT NULL,
  `professionId` int DEFAULT NULL,
  `componentId` int DEFAULT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c0e22b5891259d4cefdb208069d` (`standId`),
  KEY `FK_d8bdbb79788b968d2f30496ea1b` (`professionId`),
  KEY `FK_ca41b8909421bbeaba1bb90c5f8` (`componentId`),
  CONSTRAINT `FK_c0e22b5891259d4cefdb208069d` FOREIGN KEY (`standId`) REFERENCES `stands` (`id`),
  CONSTRAINT `FK_ca41b8909421bbeaba1bb90c5f8` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_d8bdbb79788b968d2f30496ea1b` FOREIGN KEY (`professionId`) REFERENCES `professions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stand_tasks`
--

LOCK TABLES `stand_tasks` WRITE;
/*!40000 ALTER TABLE `stand_tasks` DISABLE KEYS */;
INSERT INTO `stand_tasks` VALUES (1,NULL,1,NULL,1,1,5,NULL,'Закупка',NULL),(3,NULL,2,NULL,2,1,NULL,NULL,'Изготовление',NULL),(4,3,2,NULL,2,1,12,NULL,'Детали ванны из оргстекла',NULL),(5,3,3,NULL,3,1,19,NULL,'Ванна из оргстекла',NULL),(6,3,4,NULL,2,1,12,NULL,'2 электрода',NULL),(7,3,5,NULL,3,1,10,NULL,'Кабель 0.75х1м с одной стороны 2 банана 4мм, с другой 2 крокодила','flagRussia.jpg'),(8,3,9,NULL,1,1,9,NULL,'РЭ электрохимический эквивалент меди','flagRussia.jpg'),(9,3,10,NULL,1,1,9,NULL,'Методичка Электрохимический эквивалент меди','flagRussia.jpg'),(10,NULL,6,NULL,1,1,9,NULL,'Проверка','flagRussia.jpg'),(11,10,6,NULL,1,1,9,NULL,'Стенд электрохимич. ЭМ','flagRussia.jpg'),(12,NULL,7,NULL,1,1,9,NULL,'Упаковка','flagRussia.jpg'),(13,12,7,NULL,1,1,9,NULL,'Упакованный стенд электрохимич. ЭМ','flagRussia.jpg'),(14,NULL,8,NULL,1,1,5,NULL,'Отправка','flagRussia.jpg');
/*!40000 ALTER TABLE `stand_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stand_tasks_components`
--

DROP TABLE IF EXISTS `stand_tasks_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stand_tasks_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentCount` int DEFAULT NULL,
  `standTaskId` int DEFAULT NULL,
  `componentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_78d13930ae2ccb11ddfb6fca6bc` (`standTaskId`),
  KEY `FK_eb128f7be471c60c48260ab521c` (`componentId`),
  CONSTRAINT `FK_78d13930ae2ccb11ddfb6fca6bc` FOREIGN KEY (`standTaskId`) REFERENCES `stand_tasks` (`id`),
  CONSTRAINT `FK_eb128f7be471c60c48260ab521c` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stand_tasks_components`
--

LOCK TABLES `stand_tasks_components` WRITE;
/*!40000 ALTER TABLE `stand_tasks_components` DISABLE KEYS */;
INSERT INTO `stand_tasks_components` VALUES (1,NULL,1,NULL),(2,1,1,1),(3,2,1,2),(4,1,1,3),(5,200,1,4),(6,2,1,5),(7,100,1,11),(8,2,1,12),(9,2,1,13),(11,NULL,3,NULL),(12,NULL,4,NULL),(13,2,4,2),(14,1,4,3),(15,NULL,5,NULL),(16,1,5,10),(17,NULL,6,NULL),(18,2,6,5),(19,NULL,7,NULL),(20,100,7,11),(21,2,7,12),(22,2,7,13),(23,NULL,8,NULL),(24,10,8,17),(25,NULL,9,NULL),(26,30,9,17),(27,NULL,10,NULL),(28,NULL,11,NULL),(29,1,11,6),(30,1,11,8),(31,200,11,4),(32,1,11,1),(33,NULL,12,NULL),(34,NULL,13,NULL),(35,1,13,6),(36,1,13,8),(37,200,13,4),(38,1,13,1),(39,1,13,14),(40,2,13,15),(41,NULL,14,NULL),(42,1,14,16);
/*!40000 ALTER TABLE `stand_tasks_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stands`
--

DROP TABLE IF EXISTS `stands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `width` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `height` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thickness` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weightNetto` float DEFAULT NULL,
  `weightBrutto` float DEFAULT NULL,
  `link` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendorCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manufactureTime` int DEFAULT NULL,
  `comment` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `standTypeId` int DEFAULT NULL,
  `employeeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4a683c164267af49454dacaa8df` (`standTypeId`),
  KEY `FK_710bd379ddc93f6b2acd74fb18b` (`employeeId`),
  KEY `FK_860779f22288048503d58dcc30f` (`parentId`),
  CONSTRAINT `FK_4a683c164267af49454dacaa8df` FOREIGN KEY (`standTypeId`) REFERENCES `stands_types` (`id`),
  CONSTRAINT `FK_710bd379ddc93f6b2acd74fb18b` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_860779f22288048503d58dcc30f` FOREIGN KEY (`parentId`) REFERENCES `stands` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stands`
--

LOCK TABLES `stands` WRITE;
/*!40000 ALTER TABLE `stands` DISABLE KEYS */;
INSERT INTO `stands` VALUES (1,NULL,'Электрохимический эквивалент меди','flagRussia.jpg','123','123','123',123,123,'https://acidic-papa.com/','123',14,'123',1,2);
/*!40000 ALTER TABLE `stands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stands_types`
--

DROP TABLE IF EXISTS `stands_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stands_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stands_types`
--

LOCK TABLES `stands_types` WRITE;
/*!40000 ALTER TABLE `stands_types` DISABLE KEYS */;
INSERT INTO `stands_types` VALUES (1,'Электрохимический');
/*!40000 ALTER TABLE `stands_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_components`
--

DROP TABLE IF EXISTS `supplier_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentId` int NOT NULL,
  `productUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e2922a3fa2220146b36a9c9a0fe` (`componentId`),
  CONSTRAINT `FK_e2922a3fa2220146b36a9c9a0fe` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_components`
--

LOCK TABLES `supplier_components` WRITE;
/*!40000 ALTER TABLE `supplier_components` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordSalt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ab4a80281f1e8d524714e00f38f` (`employeeId`),
  CONSTRAINT `FK_ab4a80281f1e8d524714e00f38f` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','123','$2b$10$fRXSVwmZRBCvbYyG7yp9C.Sa9wtboNXwPDF7xse4OJB0xMaQhpWLi',1),(2,'vera','123','$2b$10$OXwm09sY1qC/MjJ.vN3m.eAIHiAmZTfVFO.j/6.zZ3aNizYfsmqvq',3),(3,'mysov-igor','123','$2b$10$zqLydG.eW2.vvx6qaxFxweeyhTw2ZAVKaSh.UUsXAEXOroeHunQXa',4),(4,'sivcova-injener','123','$2b$10$Zy7C1JsidB8DYRu7oo1LqeMS5FTQ/LN6Is5RNieJ6HRQ156EQcXSK',5),(5,'kisel','123','$2b$10$KyAkwJ.5tkxLl.4AImM3WOPPnG1lnFLhQk4OuPUH/MO3a6tw3F0Ma',6),(6,'himik','123','$2b$10$3j327WzPsaC7njQ1Sw/VZ.56ATTphafE5AWZI1L.TpXntmoYuQl.m',7),(7,'tokar','123','$2b$10$u9OTkx1VBSuPmUP0DkXZKeowmdmgDKgJYg6k8r6ZbC93JIs9Xoiqi',8);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writeoff`
--

DROP TABLE IF EXISTS `writeoff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `writeoff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dateTime` date NOT NULL,
  `count` int NOT NULL,
  `comment` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `writeoffReasonId` int DEFAULT NULL,
  `componentId` int DEFAULT NULL,
  `factoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_cf9911a14c498e5f8eb7b4665ed` (`writeoffReasonId`),
  KEY `FK_7e3ac4f0e611921af4ead6c2984` (`componentId`),
  KEY `FK_f9ffda080c6cd05187e97430eee` (`factoryId`),
  CONSTRAINT `FK_7e3ac4f0e611921af4ead6c2984` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `FK_cf9911a14c498e5f8eb7b4665ed` FOREIGN KEY (`writeoffReasonId`) REFERENCES `writeoff_reasons` (`id`),
  CONSTRAINT `FK_f9ffda080c6cd05187e97430eee` FOREIGN KEY (`factoryId`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writeoff`
--

LOCK TABLES `writeoff` WRITE;
/*!40000 ALTER TABLE `writeoff` DISABLE KEYS */;
/*!40000 ALTER TABLE `writeoff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writeoff_reasons`
--

DROP TABLE IF EXISTS `writeoff_reasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `writeoff_reasons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writeoff_reasons`
--

LOCK TABLES `writeoff_reasons` WRITE;
/*!40000 ALTER TABLE `writeoff_reasons` DISABLE KEYS */;
INSERT INTO `writeoff_reasons` VALUES (1,'Утеря'),(2,'Повреждение'),(3,'Брак'),(4,'Истечение срока годности');
/*!40000 ALTER TABLE `writeoff_reasons` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-20 18:40:12
