-- MySQL dump 10.13  Distrib 8.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: peluqueriaaa
-- ------------------------------------------------------
-- Server version	8.1.0

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

--
-- Table structure for table `disponibilidades`
--

DROP TABLE IF EXISTS `disponibilidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disponibilidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `servicio_id` int NOT NULL,
  `disponible` tinyint(1) DEFAULT '1',
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `servicio_id` (`servicio_id`),
  CONSTRAINT `disponibilidades_ibfk_1` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disponibilidades`
--

LOCK TABLES `disponibilidades` WRITE;
/*!40000 ALTER TABLE `disponibilidades` DISABLE KEYS */;
INSERT INTO `disponibilidades` VALUES (17,1,1,NULL,NULL),(18,1,1,NULL,NULL),(19,1,1,NULL,NULL),(20,1,1,NULL,NULL),(21,1,1,NULL,NULL),(22,1,1,'2024-06-07 03:30:00','2024-06-07 05:00:00'),(23,2,1,'2024-06-07 06:00:00','2024-06-07 07:00:00'),(24,1,1,'2024-06-08 06:00:00','2024-06-08 07:00:00'),(25,2,1,'2024-06-08 04:00:00','2024-06-08 05:00:00'),(26,3,1,'2024-06-08 08:00:00','2024-06-08 09:00:00'),(27,4,1,'2024-06-08 10:00:00','2024-06-08 11:00:00'),(28,5,1,'2024-06-08 11:30:00','2024-06-08 13:00:00'),(29,6,1,'2024-06-08 14:00:00','2024-06-08 15:00:00'),(30,1,1,'2024-06-05 07:00:00','2024-06-05 08:00:00'),(31,3,1,'2024-06-04 12:00:00','2024-06-04 13:00:00'),(32,2,1,'2024-06-05 14:30:00','2024-06-05 15:30:00'),(33,1,0,'2024-06-04 04:00:00','2024-06-04 05:00:00'),(34,1,1,'2024-06-04 06:00:00','2024-06-04 07:00:00'),(35,2,1,'2024-06-04 05:00:00','2024-06-04 06:00:00'),(36,1,1,'2024-06-06 05:00:00','2024-06-06 05:30:00'),(37,1,0,'2024-08-21 14:18:00','2024-08-21 15:18:00'),(38,4,0,'2024-08-21 06:30:00','2024-08-21 07:30:00'),(39,1,0,'2024-08-21 07:00:00','2024-08-21 08:00:00'),(40,5,0,'2024-08-21 06:30:00','2024-08-21 08:00:00'),(41,1,0,'2024-08-21 04:00:00','2024-08-21 05:00:00'),(42,1,0,'2024-08-21 10:00:00','2024-08-21 11:30:00'),(43,1,0,'2024-08-22 05:00:00','2024-08-22 06:00:00'),(44,1,0,'2024-08-22 07:00:00','2024-08-22 08:00:00'),(45,1,0,'2024-08-22 09:00:00','2024-08-22 10:00:00'),(46,1,0,'2024-08-22 11:00:00','2024-08-22 12:30:00'),(47,1,0,'2024-08-22 14:30:00','2024-08-22 15:30:00'),(48,1,0,'2024-08-22 19:30:00','2024-08-22 21:00:00'),(49,1,0,'2024-08-22 17:00:00','2024-08-22 17:30:00'),(50,1,0,'2024-08-22 03:00:00','2024-08-22 05:00:00'),(51,1,0,'2024-08-22 05:30:00','2024-08-22 06:30:00'),(52,1,0,'2024-08-22 06:00:00','2024-08-22 08:00:00'),(53,1,0,'2024-08-22 06:30:00','2024-08-22 08:30:00'),(54,1,0,'2024-08-22 09:30:00','2024-08-22 10:30:00'),(55,1,0,'2024-08-22 10:00:00','2024-08-22 11:30:00'),(56,1,0,'2024-08-22 13:30:00','2024-08-22 14:30:00'),(57,1,0,'2024-08-22 14:00:00','2024-08-22 14:30:00'),(58,1,1,'2024-08-22 15:30:00','2024-08-22 17:30:00'),(59,1,1,'2024-08-22 17:30:00','2024-08-22 19:30:00'),(60,1,1,'2024-08-22 20:00:00','2024-08-22 21:00:00'),(61,2,1,'2024-08-22 10:30:00','2024-08-22 11:00:00'),(62,1,0,'2024-08-24 08:00:00','2024-08-24 09:00:00'),(63,2,1,'2024-08-24 06:30:00','2024-08-24 07:30:00'),(64,2,1,'2024-08-24 06:30:00','2024-08-24 07:30:00'),(65,2,1,'2024-08-24 09:00:00','2024-08-24 09:30:00'),(66,2,1,'2024-08-25 07:30:00','2024-08-25 08:00:00'),(67,2,1,'2024-08-26 07:00:00','2024-08-26 08:30:00'),(68,5,1,'2024-08-15 07:00:00','2024-08-15 08:00:00'),(69,1,1,'2024-08-30 15:30:00','2024-08-30 17:00:00'),(70,1,1,'2024-08-30 12:30:00','2024-08-30 13:30:00'),(71,1,1,'2024-08-30 18:00:00','2024-08-30 19:00:00'),(72,1,1,'2024-08-23 08:00:00','2024-08-23 09:00:00'),(73,1,1,'2024-08-23 10:00:00','2024-08-23 11:00:00'),(74,1,1,'2024-08-23 11:00:00','2024-08-23 12:00:00'),(75,1,1,'2024-08-23 09:00:00','2024-08-23 10:00:00'),(76,1,1,'2024-08-29 02:00:00','2024-08-29 03:00:00'),(77,1,1,'2024-08-29 13:00:00','2024-08-29 14:00:00'),(78,1,1,'2024-08-29 04:30:00','2024-08-29 06:00:00'),(79,1,1,'2024-08-29 04:00:00','2024-08-29 05:00:00'),(80,1,0,'2024-08-31 12:00:00','2024-08-31 13:00:00'),(81,1,1,'2024-08-27 05:00:00','2024-08-27 06:00:00'),(82,1,0,'2024-08-21 08:00:00','2024-08-21 09:00:00'),(83,1,1,'2024-08-26 08:00:00','2024-08-26 09:00:00'),(84,1,0,'2024-08-15 04:00:00','2024-08-15 05:00:00'),(86,1,1,'2024-08-25 05:00:00','2024-08-25 06:00:00'),(87,1,1,'2024-08-25 04:00:00','2024-08-25 04:30:00'),(88,1,1,'2024-08-25 04:00:00','2024-08-25 05:00:00'),(89,1,1,'2024-08-25 04:00:00','2024-08-25 04:30:00'),(90,1,1,'2024-08-25 04:00:00','2024-08-25 05:00:00'),(91,1,1,'2024-08-25 07:00:00','2024-08-25 08:00:00'),(92,1,1,'2024-08-25 09:00:00','2024-08-25 10:00:00'),(93,1,1,'2024-08-25 08:00:00','2024-08-25 09:00:00'),(94,1,1,'2024-08-25 08:00:00','2024-08-25 09:00:00'),(95,1,1,'2024-08-25 11:00:00','2024-08-25 12:00:00'),(96,1,1,'2024-08-25 13:00:00','2024-08-25 14:00:00'),(99,1,1,'2024-08-08 02:00:00','2024-08-08 03:00:00'),(100,1,1,'2024-08-08 03:00:00','2024-08-08 04:00:00'),(101,1,1,'2024-08-08 03:30:00','2024-08-08 04:30:00'),(103,1,0,'2024-08-09 05:00:00','2024-08-09 06:00:00'),(104,1,0,'2024-08-14 04:00:00','2024-08-14 05:00:00'),(105,1,0,'2024-08-14 05:00:00','2024-08-14 06:00:00'),(108,1,1,'2024-08-17 07:00:00','2024-08-17 08:00:00'),(110,3,1,'2024-08-29 03:00:00','2024-08-29 04:00:00'),(112,1,0,'2024-08-31 09:00:00','2024-08-31 10:00:00'),(113,1,0,'2024-08-24 04:30:00','2024-08-24 06:00:00'),(114,1,0,'2024-09-27 03:00:00','2024-09-27 04:00:00'),(115,1,0,'2024-09-27 05:00:00','2024-09-27 06:00:00'),(116,1,0,'2024-09-27 05:30:00','2024-09-27 06:00:00');
/*!40000 ALTER TABLE `disponibilidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderproducts`
--

DROP TABLE IF EXISTS `orderproducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderproducts` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ProductOrderId` int NOT NULL,
  `ProductId` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`ProductOrderId`,`ProductId`),
  UNIQUE KEY `order_products__product_id__product_order_id` (`ProductId`,`ProductOrderId`),
  CONSTRAINT `orderproducts_ibfk_1` FOREIGN KEY (`ProductOrderId`) REFERENCES `productorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderproducts_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderproducts`
--

LOCK TABLES `orderproducts` WRITE;
/*!40000 ALTER TABLE `orderproducts` DISABLE KEYS */;
INSERT INTO `orderproducts` VALUES ('2024-08-30 21:27:43','2024-08-30 21:27:43',5,5,2),('2024-08-31 01:39:08','2024-08-31 01:39:08',6,5,2),('2024-08-31 01:39:08','2024-08-31 01:39:08',6,6,1),('2024-08-31 01:42:01','2024-08-31 01:42:01',7,5,1),('2024-08-31 01:42:36','2024-08-31 01:42:36',8,5,1),('2024-08-31 19:55:56','2024-08-31 19:55:56',21,5,1),('2024-09-02 00:05:28','2024-09-02 00:05:28',32,5,1),('2024-09-02 00:11:52','2024-09-02 00:11:52',33,5,1),('2024-09-02 00:12:22','2024-09-02 00:12:22',34,7,1),('2024-09-06 04:52:45','2024-09-06 04:52:45',35,5,1),('2024-09-07 10:32:29','2024-09-07 10:32:29',36,5,2),('2024-09-07 10:33:08','2024-09-07 10:33:08',37,5,1),('2024-09-08 08:05:39','2024-09-08 08:05:39',40,5,1),('2024-09-08 09:11:19','2024-09-08 09:11:19',41,7,1),('2024-09-08 09:28:02','2024-09-08 09:28:02',42,6,1),('2024-09-20 07:39:46','2024-09-20 07:39:46',44,5,1);
/*!40000 ALTER TABLE `orderproducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `disponibilidad_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pendiente',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `orders_ibfk_2` (`disponibilidad_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`disponibilidad_id`) REFERENCES `disponibilidades` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (6,10,33,25.00,'aprobado','2024-06-07 05:59:22','2024-09-02 17:40:22'),(7,16,41,25.00,'aprobado','2024-08-21 22:09:35','2024-09-02 17:41:57'),(8,16,42,25.00,'pendiente','2024-08-21 22:14:54','2024-09-02 17:27:41'),(9,16,37,25.00,'pendiente','2024-08-22 17:11:26','2024-09-02 17:30:09'),(10,16,39,25.00,'aprobado','2024-08-22 18:36:06','2024-09-02 06:04:59'),(11,16,40,80.00,'aprobado','2024-08-22 18:36:23','2024-09-03 05:52:02'),(12,16,38,20.00,'aprobado','2024-08-22 18:36:54','2024-09-02 17:24:34'),(13,17,43,25.00,'pendiente','2024-08-22 18:44:35','2024-09-02 17:24:41'),(14,17,44,25.00,'pendiente','2024-08-22 18:49:35','2024-09-02 17:31:58'),(15,17,45,25.00,'aprobado','2024-08-22 18:49:56','2024-09-02 06:08:45'),(16,17,46,25.00,'pendiente','2024-08-22 18:51:53','2024-08-22 18:51:53'),(17,17,47,25.00,'pendiente','2024-08-22 18:52:01','2024-08-22 18:52:01'),(18,17,49,25.00,'pendiente','2024-08-22 18:58:58','2024-08-22 18:58:58'),(19,17,48,25.00,'pendiente','2024-08-22 18:59:53','2024-08-22 18:59:53'),(20,17,50,25.00,'pendiente','2024-08-22 19:05:24','2024-08-22 19:05:24'),(21,17,51,25.00,'pendiente','2024-08-22 19:05:36','2024-08-22 19:05:36'),(22,17,52,25.00,'pendiente','2024-08-22 19:09:54','2024-08-22 19:09:54'),(23,17,53,25.00,'pendiente','2024-08-22 19:12:38','2024-08-22 19:12:38'),(24,17,54,25.00,'pendiente','2024-08-22 19:18:37','2024-08-22 19:18:37'),(25,17,55,25.00,'pendiente','2024-08-22 22:16:50','2024-08-22 22:16:50'),(26,17,56,25.00,'pendiente','2024-08-24 20:49:59','2024-08-24 20:49:59'),(27,17,103,25.00,'pendiente','2024-08-26 02:39:50','2024-08-26 02:39:50'),(28,17,80,25.00,'pendiente','2024-08-26 04:49:38','2024-08-26 04:49:38'),(29,17,62,25.00,'pendiente','2024-08-26 04:56:57','2024-08-26 04:56:57'),(30,17,57,25.00,'pendiente','2024-08-29 08:52:27','2024-08-29 08:52:27'),(31,17,82,25.00,'pendiente','2024-08-29 08:53:06','2024-08-29 08:53:06'),(32,17,105,25.00,'pendiente','2024-08-29 08:56:28','2024-08-29 08:56:28'),(33,17,84,25.00,'pendiente','2024-08-29 09:00:36','2024-08-29 09:00:36'),(34,17,114,25.00,'pendiente','2024-09-03 06:26:18','2024-09-03 06:26:18'),(35,17,115,25.00,'pendiente','2024-09-03 06:26:49','2024-09-03 06:26:49'),(36,17,116,25.00,'pendiente','2024-09-03 06:27:08','2024-09-03 06:27:08'),(37,17,113,25.00,'pendiente','2024-09-03 06:55:33','2024-09-03 06:55:33'),(38,17,112,25.00,'pendiente','2024-09-03 06:56:41','2024-09-03 06:56:41');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productorders`
--

DROP TABLE IF EXISTS `productorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productorders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `shipping_method` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pendiente',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_proof` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_user_orders` (`user_id`),
  CONSTRAINT `FK_user_orders` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productorders`
--

LOCK TABLES `productorders` WRITE;
/*!40000 ALTER TABLE `productorders` DISABLE KEYS */;
INSERT INTO `productorders` VALUES (4,9,'123123123123123',31.96,'local_pickup',NULL,NULL,'asdasd','pendiente','2024-08-30 20:01:48','2024-09-20 04:18:13',NULL),(5,9,'2964541181',31.98,'local_pickup',NULL,NULL,'depositvo','pendiente','2024-08-30 21:27:43','2024-08-30 21:27:43',NULL),(6,9,'123123123123',278.96,'local_pickup',NULL,NULL,'asdsad','pendiente','2024-08-31 01:39:08','2024-08-31 01:39:08',NULL),(7,9,'1231231233',15.99,'local_pickup',NULL,NULL,'sadsadsd','aprobado','2024-08-31 01:42:01','2024-08-31 04:59:54',NULL),(8,9,'123123123123',15.99,'delivery','liniers','Rio Grande','depositoo','pendiente','2024-08-31 01:42:36','2024-08-31 01:42:36',NULL),(9,17,'123123123123',15.98,'local_pickup',NULL,NULL,'asd','aprobado','2024-08-31 04:47:36','2024-08-31 05:00:05',NULL),(10,17,'111111111111',15.98,'local_pickup',NULL,NULL,'111111','pendiente','2024-08-31 05:01:04','2024-08-31 05:01:04',NULL),(11,9,'2964541181',15.98,'local_pickup',NULL,NULL,'','pendiente','2024-08-31 18:16:09','2024-08-31 18:16:09','1725128169158-19278400.png'),(21,9,'123123123123',15.99,'local_pickup',NULL,NULL,'deposito','pendiente','2024-08-31 19:55:56','2024-08-31 19:55:56','1725134156322-400232412.jpg'),(25,9,'123123123123',15.98,'local_pickup',NULL,NULL,'mercadopago','pendiente','2024-08-31 21:38:48','2024-08-31 21:38:48',NULL),(28,9,'123123123123',15.98,'local_pickup',NULL,NULL,'mercadopago','pendiente','2024-08-31 21:44:38','2024-08-31 21:44:38',NULL),(29,9,'123123123123123',15.98,'local_pickup',NULL,NULL,'mercadopago','pendiente','2024-08-31 21:46:26','2024-08-31 21:46:26',NULL),(30,9,'123123123123',15.98,'local_pickup',NULL,NULL,'mercadopago','pendiente','2024-08-31 21:49:14','2024-08-31 21:49:14',NULL),(31,9,'123123123123',15.98,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-02 00:01:40','2024-09-02 00:01:40','1725235277862-455594762.png'),(32,9,'123123123123',15.99,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-02 00:05:28','2024-09-02 00:05:28','1725235506013-511611800.png'),(33,9,'123123123123',15.99,'local_pickup',NULL,NULL,'deposito','rechazado','2024-09-02 00:11:52','2024-09-02 04:48:18','1725235912661-98653410.png'),(34,9,'123123123123',123.00,'local_pickup',NULL,NULL,'deposito','aprobado','2024-09-02 00:12:22','2024-09-02 04:48:04','1725235942373-593973281.jpg'),(35,9,'123123123123',15.99,'local_pickup',NULL,NULL,'deposito','aprobado','2024-09-06 04:52:45','2024-09-07 04:40:26','1725598365456-723161438.jpg'),(36,34,'121212121212',31.98,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-07 10:32:29','2024-09-07 10:32:29','1725705149292-139492301.jpg'),(37,34,'2323232323',15.99,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-07 10:33:08','2024-09-07 10:33:08','1725705188658-11579580.jpg'),(38,34,'21313123123',15.98,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-07 10:43:26','2024-09-07 10:43:26','1725705806346-96710156.jpg'),(39,34,'453534534545',15.98,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-07 10:44:49','2024-09-07 10:44:49','1725705889341-892026802.jpg'),(40,9,'123123123123',15.99,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-08 08:05:39','2024-09-08 08:05:39','1725782739578-555489901.jpg'),(41,9,'213123123123123',123.00,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-08 09:11:19','2024-09-08 09:11:19','1725786679163-382968301.jpg'),(42,34,'123123123123123',231.00,'local_pickup',NULL,NULL,'deposito','aprobado','2024-09-08 09:28:02','2024-09-20 04:18:23','1725787682611-954552714.jpg'),(44,17,'1111111111111',15.99,'local_pickup',NULL,NULL,'deposito','pendiente','2024-09-20 04:39:46','2024-09-20 04:39:46','1726817986663-78495761.jpg');
/*!40000 ALTER TABLE `productorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `imageFileName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isFeatured` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (5,'Clipper Profesional',0.01,'1725234365941-164142791.webp',36,'Este clipper profesional es la herramienta definitiva para cortes precisos y eficientes en cualquier barbería o salón de belleza. Su diseño ergonómico y potente motor aseguran un rendimiento óptimo, incluso en los cabellos más gruesos. Ideal para profesionales que buscan calidad y durabilidad en cada corte.','2024-08-29 06:15:04','2024-09-20 08:38:03',1),(6,'Crema para Estilismo Capilar',231.00,'1725234403429-387245587.webp',212,'Un elegante tarro de crema para estilismo capilar que proporciona fijación y control sin dejar residuos. Ideal para crear una variedad de estilos, desde peinados estructurados hasta looks más naturales, ofreciendo un acabado brillante y duradero.','2024-08-30 06:18:50','2024-09-08 04:19:18',1),(7,'Crema de Afeitar',123.00,'1725234442481-527976728.webp',122,'Un tubo de crema de afeitar que proporciona una espuma rica y cremosa para un afeitado suave y apurado. Formulada para minimizar la irritación, esta crema es ideal para todo tipo de pieles, dejando el rostro fresco y bien cuidado.','2024-08-30 06:23:10','2024-09-20 03:37:56',1),(10,'Kit de Aseo Profesional para Barberos',123.00,'1725234472279-197815995.webp',123,'Un completo kit de aseo profesional que incluye una selección de herramientas premium como tijeras, peines, clippers, y accesorios adicionales. Este set es ideal para barberos que buscan una solución todo en uno para ofrecer servicios de alta calidad a sus clientes.','2024-08-30 06:23:16','2024-09-08 21:11:26',0),(12,'Loción para Después del Afeitado',123.00,'1725234502188-728214748.webp',123,'Una botella de loción para después del afeitado que calma y refresca la piel. Enriquecida con ingredientes nutritivos, esta loción ayuda a reducir la irritación post-afeitado, dejando una sensación de frescura y suavidad en la piel.','2024-08-30 06:24:22','2024-09-01 23:54:46',0),(13,'Frasco de pomada para el cabello',123.00,'1725234528418-884552767.webp',123,'asd','2024-08-30 06:24:37','2024-09-01 23:48:48',0),(14,'Razor de barbero profesional',123.00,'1725234552428-675373072.webp',123,'Este razor de barbero es la elección perfecta para un afeitado apurado y definido. Con una hoja afilada y un diseño equilibrado, permite realizar contornos y detalles con gran precisión, garantizando un acabado limpio y profesional en cada afeitado.','2024-08-30 06:24:38','2024-09-01 23:52:19',0),(15,'Tijeras Profesionales de Corte',123.00,'1725234663354-19155656.webp',50,'Un par de tijeras profesionales diseñadas para ofrecer cortes precisos y suaves. Estas tijeras son esenciales en el arsenal de cualquier estilista o barbero, proporcionando un control superior y una experiencia de corte sin esfuerzo, perfectas para técnicas avanzadas y detalles finos.','2024-09-01 23:51:03','2024-09-01 23:51:43',0),(17,'asdasd',23.00,'1726136823291-996930553.jpg',123,'asd','2024-09-12 10:27:03','2024-09-12 10:27:03',0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`),
  UNIQUE KEY `nombre_6` (`nombre`),
  UNIQUE KEY `nombre_7` (`nombre`),
  UNIQUE KEY `nombre_8` (`nombre`),
  UNIQUE KEY `nombre_9` (`nombre`),
  UNIQUE KEY `nombre_10` (`nombre`),
  UNIQUE KEY `nombre_11` (`nombre`),
  UNIQUE KEY `nombre_12` (`nombre`),
  UNIQUE KEY `nombre_13` (`nombre`),
  UNIQUE KEY `nombre_14` (`nombre`),
  UNIQUE KEY `nombre_15` (`nombre`),
  UNIQUE KEY `nombre_16` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','2024-09-04 03:07:52','2024-09-04 03:07:52'),(2,'empleado','2024-09-04 04:52:02','2024-09-04 04:52:02'),(3,'user','2024-09-20 05:11:25','2024-09-20 05:11:25');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20240605215446-add-fecha-inicio-fecha-fin-to-disponibilidades.js'),('20240605220324-remove-fecha-hora-from-disponibilidades.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Corte de Cabello','Corte de cabello para hombres y mujeres',25.00),(2,'Peinado','Peinado para eventos',30.00),(3,'Tintura','Tintura de cabello completa',50.00),(4,'Lavado y Secado','Lavado y secado de cabello',20.00),(5,'Alisado Permanente','Tratamiento de alisado de cabello',80.00),(6,'Corte de Barba','Corte y arreglo de barba',15.00);
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int NOT NULL,
  `RoleId` int NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('2024-09-20 03:22:18','2024-09-20 03:22:18',1,2),('2024-09-04 07:28:53','2024-09-04 07:28:53',9,1),('2024-09-06 04:42:53','2024-09-06 04:42:53',34,2),('2024-09-20 05:12:26','2024-09-20 05:12:26',38,3);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `googleId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiration` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'peter','sofia@asd.com',NULL,'$2b$10$vmAtSVLf14cy4D.Kpr0F/.OzCt936AS6VVarhn5Vo3491I9wZGILO','2024-05-26 20:33:12','2024-09-03 10:43:45','','',NULL,NULL,NULL),(2,'123','lnicolas62@yahoo.com',NULL,'$2b$10$MMg/o8HqBd43iovCZTCpROxQVKm80TQn4hLloiF6Nc5JYPBBFqOfy','2024-05-26 22:50:39','2024-09-03 05:24:26','','',NULL,NULL,NULL),(4,'sofia','lnicolas6222@yahoo.com',NULL,'$2b$10$Z95wBdYxJeeTZyoXyvYPqud/M/m1x6dHh4DBiAO.zjb8mq/V5nVl.','2024-05-26 22:55:09','2024-09-03 05:24:27','','',NULL,NULL,NULL),(6,'','',NULL,'$2b$10$/8tTxSxOXqvvr.ngMFcwyOwMZphVld.cXHHDJQwZa6W0KTdozO8Ti','2024-05-27 00:59:37','2024-09-03 05:48:16','','',NULL,NULL,NULL),(7,'sofia','lnicolas632@yahoo.com',NULL,'$2b$10$zJGbiaiun7zxuZFU12LM7e6rrOhb3WaHsRQ1cA.O.86XsRUEnfKuW','2024-05-27 01:15:34','2024-09-03 05:48:14','','',NULL,NULL,NULL),(8,'Sofia','lnicolaas62@yahoo.com',NULL,'$2b$10$1mUriZGDWZIWS/l58ijJo.tSsDWPP6VG53LJzKEz8cty/WQ8ongJO','2024-06-03 03:41:18','2024-06-03 03:41:18','','',NULL,NULL,NULL),(9,'Sofia','lnicolas622@yahoo.com',NULL,'$2b$10$un1Oym5dEhG1gRjszqdwcukuLhV0V2JDgpLJP.rJ1DSscG8tx.kES','2024-06-03 03:58:20','2024-09-03 05:22:13','','',NULL,NULL,NULL),(10,'Sofia','lnicolas623@yahoo.com',NULL,'$2b$10$v.8O5TPWe9bwxYnV4tIBs.GpacsJ0frXk5neypTvncB9n7O8Z8WQy','2024-06-03 04:01:21','2024-06-03 04:01:21','','',NULL,NULL,NULL),(11,'Sofiaa','lnicolas6223@yahoo.com',NULL,'$2b$10$w93HHEsgFF6hREkOQZmz5em.q6E11RuP1NHPvR3/QvqROuWVVe0LW','2024-06-03 04:27:30','2024-06-03 04:27:30','','',NULL,NULL,NULL),(12,'asd','asdasd@yahoo.com',NULL,'$2b$10$qM/O/wfZzeAt04tmpwgmz.UZM4f2AGgiaodsmKwO3hBmwLfKCiM7e','2024-06-06 00:48:54','2024-06-06 00:48:54','','',NULL,NULL,NULL),(13,'asdasd','asdasdasd@yahoo.com',NULL,'$2b$10$xxL5UIqihjgUmO2yyYD/BOwfHcRpIPnHq6D2jI/4oxyCiRWpAIIye','2024-06-06 00:50:08','2024-06-06 00:50:08','','',NULL,NULL,NULL),(14,'asd','asdasdasdasd@yahoo.com',NULL,'$2b$10$..omXcIlC1yj1eZMEcUCguPjBDMsHmtAOIH9iyg2AjiSbxjjyEP7S','2024-06-06 00:52:36','2024-06-06 00:52:36','','',NULL,NULL,NULL),(15,'Sofiaaaaa','lnicasdolas6223@yahoo.com',NULL,'$2b$10$b.8AzLjOReAs0p7Fy4aBPeR0WEeUf9GII6BkaKp1msYZ0Yw.i8S6a','2024-06-07 05:42:03','2024-06-07 05:42:03','','',NULL,NULL,NULL),(16,'Sofia','lnicolas64@yahoo.com',NULL,'$2b$10$iW/rcARYScmTrAbhruPnt.TWOmvOoXmKwsCqI6fnip8YHCcjiX1h.','2024-08-21 21:30:12','2024-08-21 21:30:12','','',NULL,NULL,NULL),(17,'asd','lnicolas65@yahoo.com',NULL,'$2b$10$YJvxlaT4x9k35ubjhjjLseMePTbXDOfs0ybvpbUGyZjHJ9brehZPq','2024-08-22 18:42:04','2024-08-22 18:42:04','','',NULL,NULL,NULL),(18,'asdasasdsd','asasdsddasd@yahoo.com',NULL,'$2b$10$RBYOBb/CWOCDB7yzAf2/mOtTyZWbjtO3ypVBPseGLT0UqeKdsO/M2','2024-08-29 08:17:21','2024-08-29 08:17:21','','',NULL,NULL,NULL),(19,'asdasd','lnicolas67@yahoo.com',NULL,'$2b$10$6N6pg82ZmPEi5QCbz3dUHuN1vQpZvhWzXbOhYIyZJKFArcfLUey0C','2024-08-29 08:17:52','2024-08-29 08:17:52','','',NULL,NULL,NULL),(20,'asdasd','lnicolas68@yahoo.com',NULL,'$2b$10$iPk7cuaXQBORah12D9FtNOtkMgaB48VqB6gLS3/vmsFMaDInZv8B2','2024-08-29 08:18:14','2024-08-29 08:18:14','','',NULL,NULL,NULL),(21,'asd','lnicolas69@yahoo.com',NULL,'$2b$10$OQrLX1oNgorhnb2k0Hf1P.LhlsSmhzYN6Tv89fd3wbjq0BY816tv.','2024-08-29 08:20:59','2024-08-29 08:20:59','','',NULL,NULL,NULL),(22,'asd','lnicolas629@yahoo.com',NULL,'$2b$10$T5oYHjXMAbtMqDqoXCxE0udPAwowB5bg1gxTBitokVwJ6qkskXQ3q','2024-08-29 08:23:30','2024-08-29 08:23:30','','',NULL,NULL,NULL),(23,'asdasd','asdasdsa@yahooc.com',NULL,'$2b$10$D2BjLQPuPZExaPnO0RrHteAZPR8aLK7LwYIEbvbB.QxgEQJugqnW6','2024-08-29 08:24:39','2024-08-29 08:24:39','','',NULL,NULL,NULL),(24,'adasdasd','lnicolas600@yahoo.com',NULL,'$2b$10$YYP4IYhBKDrWlBCRhqODQeoWteCG/adbHb3pDYueKGXK4dEtet5ZW','2024-08-29 08:24:57','2024-08-29 08:24:57','','',NULL,NULL,NULL),(25,'asdasd','sadasdasdasdas@yahoo.com',NULL,'$2b$10$Stq8lrJsucwZNL74fssdrOeVvsaWmYtjJan7JxCkio4ZGR9myU/0C','2024-08-29 08:25:32','2024-08-29 08:25:32','','',NULL,NULL,NULL),(26,'asdas','asdaasdasd12sds@asd.com',NULL,'$2b$10$krqWbWX2r4iX2pPvAAQt8uRfJ.9mYXFsdpt75Pi9U9gFK5K13Av4S','2024-08-29 08:26:51','2024-08-29 08:26:51','','',NULL,NULL,NULL),(27,'asda','asda32@yahoo.com',NULL,'$2b$10$qZ/lyYi8ghxB6b0ehXIcdu9LZlbpIQgezWpMwkD8wLqDNeq0YWafq','2024-08-29 08:31:36','2024-08-29 08:31:36','','',NULL,NULL,NULL),(28,'sads','234df@asd.com',NULL,'$2b$10$ZcBfVUz999p0dspL8Sdg2u8bY8NHWJrKDlQouYjmw/wMrPMqytaDO','2024-08-29 08:33:17','2024-08-29 08:33:17','','',NULL,NULL,NULL),(29,'asd','asd2as@yahoo.com',NULL,'$2b$10$/8.X2uvIDDKv3HLRPnGm4OoyV0Z4z7cS.UPQm8TT.7nNroGK/0TYa','2024-08-29 08:34:07','2024-08-29 08:34:07','','',NULL,NULL,NULL),(30,'a','peter@yahoo.com',NULL,'$2b$10$/AKu/ABoQNQ.sQfcVr31dujqrzgwdCFDvXW3jOCrrgqCo/weXYqV.','2024-08-29 08:36:15','2024-08-29 08:36:15','','',NULL,NULL,NULL),(31,'asd','dfgdfg@sadasdas.com',NULL,'$2b$10$GI8APIOQHaLQr3wTg8Ljh.zXOIA8ap/jiKr7C0RyZaUZ2kb71QX6m','2024-09-03 05:59:53','2024-09-03 05:59:53','','',NULL,NULL,NULL),(32,'213123','asdawesadsd@yahoo.com',NULL,'$2b$10$/ATXMuu/HkwCg1po88hYiuBDU13s8PmDyJsKvshDdqxomQygbYtFe','2024-09-03 06:03:40','2024-09-03 06:03:40','','',NULL,NULL,NULL),(33,'Nicolas','lnicolas6221@yahoo.com',NULL,'$2b$10$S1aU4y0522OFdIpqd0sWcu/HO8gGfyRLhvahK45x0Zmo6g/Q8wapa','2024-09-04 04:39:51','2024-09-04 04:39:51','Luciuk','2964541181',NULL,NULL,NULL),(34,'Nicolas','nicolasluciuk@yahoo.com',NULL,'$2b$10$bzXFkDLwB4jHDOB/GWhduOofuf2Z6vMs37OX9kqJ5LWZSCrNKjgIO','2024-09-04 04:58:51','2024-09-04 04:58:51','Luciuk','2964541181','1725425931238-34072397.jpg','ee26c67cc0207955fe6f7efc29a235db7f18110854783179d13b0ad7d1794c54','2024-09-20 18:30:23'),(35,'asd','asdsad12354@yahoo.com',NULL,'$2b$10$6c1S4QKXUcuyrP1EHiDeaOYU9CpJxu93tBICGl9bTM8geaw2Vuli6','2024-09-05 23:42:44','2024-09-05 23:42:44','asd','123123123123',NULL,NULL,NULL),(36,'nicolas','nicolasluciukk@yahoo.com',NULL,'$2b$10$cwZ8UX1ENKYea4BoiB.lOenBm10DqAJbMgOXAIqqykJz6Mu1sh.ne','2024-09-05 23:46:32','2024-09-05 23:46:32','luciuk','2964541181','1725579992323-111439875.png',NULL,NULL),(37,'asd','asda2q3d@asd.com',NULL,'$2b$10$RLd2EXgOFQsPaqwutfv6AuLuIFkdT3Hujdy9sXZvC9YSv5KknMCYu','2024-09-08 11:58:46','2024-09-08 11:58:46','asd','123123123123','1725796724234-622260944.jpg',NULL,NULL),(38,'Luis','lnicolas655@yahoo.com',NULL,'$2b$10$twRIrnMQriVpcTuwIDFLGexdjAcLrd.sSBIUxD/6ofLOdP3iQ8XVm','2024-09-20 05:12:26','2024-09-20 05:12:26','Luciuk','2964541181','1726819946895-830011694.jpg',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userservices`
--

DROP TABLE IF EXISTS `userservices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userservices` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int NOT NULL,
  `serviceId` int NOT NULL,
  PRIMARY KEY (`userId`,`serviceId`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `userservices_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userservices_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `servicios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userservices`
--

LOCK TABLES `userservices` WRITE;
/*!40000 ALTER TABLE `userservices` DISABLE KEYS */;
INSERT INTO `userservices` VALUES ('2024-09-07 10:22:47','2024-09-07 10:22:47',1,2),('2024-09-05 20:05:36','2024-09-05 20:05:36',16,1),('2024-09-05 20:06:49','2024-09-05 20:06:49',30,1),('2024-09-20 03:08:47','2024-09-20 03:08:47',34,1),('2024-09-20 03:08:59','2024-09-20 03:08:59',34,2),('2024-09-20 03:11:50','2024-09-20 03:11:50',34,4),('2024-09-20 03:13:07','2024-09-20 03:13:07',34,5),('2024-09-20 03:20:06','2024-09-20 03:20:06',34,6);
/*!40000 ALTER TABLE `userservices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userservicio`
--

DROP TABLE IF EXISTS `userservicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userservicio` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ServicioId` int NOT NULL,
  PRIMARY KEY (`ServicioId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userservicio`
--

LOCK TABLES `userservicio` WRITE;
/*!40000 ALTER TABLE `userservicio` DISABLE KEYS */;
/*!40000 ALTER TABLE `userservicio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-23 12:57:15
