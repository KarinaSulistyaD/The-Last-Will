-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: the_last_will
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

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
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `audit_log_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `actor_user_id` bigint(20) unsigned DEFAULT NULL,
  `will_id` bigint(20) unsigned DEFAULT NULL,
  `event_type` varchar(100) NOT NULL,
  `event_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`event_data`)),
  `sequence_no` bigint(20) unsigned NOT NULL,
  `previous_hash` char(64) DEFAULT NULL,
  `entry_hash` char(64) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`audit_log_id`),
  UNIQUE KEY `uq_audit_sequence` (`sequence_no`),
  KEY `idx_audit_actor_time` (`actor_user_id`,`created_at`),
  KEY `idx_audit_will_time` (`will_id`,`created_at`),
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_audit_will` FOREIGN KEY (`will_id`) REFERENCES `wills` (`will_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `death_verifications`
--

DROP TABLE IF EXISTS `death_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `death_verifications` (
  `verification_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `will_id` bigint(20) unsigned NOT NULL,
  `heir_user_id` bigint(20) unsigned NOT NULL,
  `document_storage_path` varchar(500) NOT NULL,
  `document_sha256` char(64) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_user_id` bigint(20) unsigned DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp(),
  `reviewed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`verification_id`),
  KEY `idx_death_verifications_will_status` (`will_id`,`status`),
  KEY `idx_death_verifications_heir` (`heir_user_id`),
  KEY `idx_death_verifications_admin` (`admin_user_id`),
  CONSTRAINT `fk_death_verifications_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_death_verifications_heir` FOREIGN KEY (`heir_user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_death_verifications_will` FOREIGN KEY (`will_id`) REFERENCES `wills` (`will_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `face_credentials`
--

DROP TABLE IF EXISTS `face_credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `face_credentials` (
  `face_credential_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `encrypted_template` longblob NOT NULL,
  `template_version` varchar(30) NOT NULL,
  `model_name` varchar(120) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `consent_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `revoked_at` datetime DEFAULT NULL,
  PRIMARY KEY (`face_credential_id`),
  UNIQUE KEY `uq_face_credentials_user` (`user_id`),
  CONSTRAINT `fk_face_credentials_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `face_verification_attempts`
--

DROP TABLE IF EXISTS `face_verification_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `face_verification_attempts` (
  `attempt_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `will_id` bigint(20) unsigned DEFAULT NULL,
  `is_success` tinyint(1) NOT NULL,
  `failure_reason_code` varchar(60) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`attempt_id`),
  KEY `idx_face_attempt_user_time` (`user_id`,`created_at`),
  KEY `idx_face_attempt_will` (`will_id`),
  CONSTRAINT `fk_face_attempt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_face_attempt_will` FOREIGN KEY (`will_id`) REFERENCES `wills` (`will_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `heirs`
--

DROP TABLE IF EXISTS `heirs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `heirs` (
  `heir_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `testator_user_id` bigint(20) unsigned NOT NULL,
  `heir_user_id` bigint(20) unsigned DEFAULT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `relationship` varchar(80) DEFAULT NULL,
  `verification_status` enum('pending','linked','rejected') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`heir_id`),
  UNIQUE KEY `uq_heirs_testator_heir` (`testator_user_id`,`heir_id`),
  UNIQUE KEY `uq_heirs_testator_email` (`testator_user_id`,`email`),
  KEY `idx_heirs_heir_user` (`heir_user_id`),
  CONSTRAINT `fk_heirs_testator` FOREIGN KEY (`testator_user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_heirs_user` FOREIGN KEY (`heir_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `key_envelopes`
--

DROP TABLE IF EXISTS `key_envelopes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `key_envelopes` (
  `key_envelope_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `will_id` bigint(20) unsigned NOT NULL,
  `wrapped_dek` longblob NOT NULL,
  `wrapping_algorithm` varchar(80) NOT NULL,
  `key_version` varchar(30) NOT NULL,
  `key_reference` varchar(190) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `revoked_at` datetime DEFAULT NULL,
  PRIMARY KEY (`key_envelope_id`),
  KEY `idx_key_envelopes_will` (`will_id`),
  CONSTRAINT `fk_key_envelopes_will` FOREIGN KEY (`will_id`) REFERENCES `wills` (`will_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stego_access_keys`
--

DROP TABLE IF EXISTS `stego_access_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stego_access_keys` (
  `stego_key_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `will_id` bigint(20) unsigned NOT NULL,
  `verifier_hash` char(64) NOT NULL,
  `verifier_version` varchar(30) NOT NULL DEFAULT '1',
  `payload_version` varchar(30) NOT NULL DEFAULT '1',
  `carrier_format` varchar(20) NOT NULL DEFAULT 'PNG',
  `stego_image_path` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `revoked_at` datetime DEFAULT NULL,
  PRIMARY KEY (`stego_key_id`),
  KEY `idx_stego_access_keys_will_active` (`will_id`,`is_active`),
  CONSTRAINT `fk_stego_access_keys_will` FOREIGN KEY (`will_id`) REFERENCES `wills` (`will_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('pewaris','ahli_waris','admin') NOT NULL,
  `account_status` enum('pending','active','suspended') NOT NULL DEFAULT 'pending',
  `email_verified_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role_status` (`role`,`account_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `will_documents`
--

DROP TABLE IF EXISTS `will_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `will_documents` (
  `document_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `will_id` bigint(20) unsigned NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `mime_type` varchar(120) NOT NULL,
  `file_size_bytes` bigint(20) unsigned NOT NULL,
  `storage_path` varchar(500) NOT NULL,
  `ciphertext_sha256` char(64) NOT NULL,
  `algorithm` varchar(80) NOT NULL DEFAULT 'AES-256-GCM',
  `algorithm_version` varchar(30) NOT NULL DEFAULT '1',
  `nonce` varbinary(32) NOT NULL,
  `auth_tag` varbinary(32) DEFAULT NULL,
  `key_envelope_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`document_id`),
  KEY `idx_will_documents_will` (`will_id`),
  KEY `idx_will_documents_key_envelope` (`key_envelope_id`),
  CONSTRAINT `fk_will_documents_key_envelope` FOREIGN KEY (`key_envelope_id`) REFERENCES `key_envelopes` (`key_envelope_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_will_documents_will` FOREIGN KEY (`will_id`) REFERENCES `wills` (`will_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `will_messages`
--

DROP TABLE IF EXISTS `will_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `will_messages` (
  `message_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `will_id` bigint(20) unsigned NOT NULL,
  `ciphertext` longblob NOT NULL,
  `algorithm` varchar(80) NOT NULL,
  `algorithm_version` varchar(30) NOT NULL,
  `nonce` varbinary(32) NOT NULL,
  `auth_tag` varbinary(32) DEFAULT NULL,
  `classical_algorithm` varchar(40) NOT NULL,
  `classical_parameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`classical_parameters`)),
  `key_envelope_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`message_id`),
  UNIQUE KEY `uq_will_messages_will` (`will_id`),
  KEY `idx_will_messages_key_envelope` (`key_envelope_id`),
  CONSTRAINT `fk_will_messages_key_envelope` FOREIGN KEY (`key_envelope_id`) REFERENCES `key_envelopes` (`key_envelope_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_will_messages_will` FOREIGN KEY (`will_id`) REFERENCES `wills` (`will_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wills`
--

DROP TABLE IF EXISTS `wills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wills` (
  `will_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `testator_user_id` bigint(20) unsigned NOT NULL,
  `heir_id` bigint(20) unsigned NOT NULL,
  `title` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('draft','active','claim_pending','ready_to_release','released','revoked') NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `activated_at` datetime DEFAULT NULL,
  `released_at` datetime DEFAULT NULL,
  `revoked_at` datetime DEFAULT NULL,
  PRIMARY KEY (`will_id`),
  KEY `idx_wills_testator_status` (`testator_user_id`,`status`),
  KEY `idx_wills_heir` (`heir_id`),
  KEY `fk_wills_heir_belongs_to_testator` (`testator_user_id`,`heir_id`),
  CONSTRAINT `fk_wills_heir_belongs_to_testator` FOREIGN KEY (`testator_user_id`, `heir_id`) REFERENCES `heirs` (`testator_user_id`, `heir_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-10  9:13:24
