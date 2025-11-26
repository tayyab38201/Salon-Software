-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS salon_management;
USE salon_management;

-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2025 at 11:13 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.0.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `salon_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `customer_id`, `service_id`, `staff_id`, `booking_date`, `booking_time`, `status`, `created_at`, `updated_at`, `price`) VALUES
(1, 1, 1, 1, '2025-11-25', '10:00:00', 'completed', '2025-11-25 04:39:04', '2025-11-25 18:30:22', '0.00'),
(2, 2, 2, 2, '2025-11-25', '14:00:00', 'completed', '2025-11-25 04:39:04', '2025-11-25 18:30:22', '0.00'),
(3, 3, 3, 3, '2025-11-25', '11:00:00', 'completed', '2025-11-25 04:39:04', '2025-11-26 10:08:48', '0.00'),
(4, 4, 4, 3, '2025-11-26', '09:00:00', 'completed', '2025-11-25 04:39:04', '2025-11-25 18:30:22', '0.00'),
(6, 6, 7, 1, '2025-12-12', '10:00:00', 'completed', '2025-11-25 04:54:28', '2025-11-25 18:30:22', '0.00'),
(7, 6, 7, 1, '2025-11-26', '02:30:00', 'confirmed', '2025-11-25 07:17:58', '2025-11-26 10:08:06', '0.00'),
(8, 7, 3, 5, '2025-12-26', '10:00:00', 'completed', '2025-11-25 17:46:17', '2025-11-25 18:30:22', '0.00'),
(9, 1, 2, 2, '2025-11-24', '10:00:00', 'completed', '2025-11-25 18:30:22', '2025-11-25 18:30:22', '0.00'),
(10, 2, 3, 3, '2025-11-23', '14:00:00', 'completed', '2025-11-25 18:30:22', '2025-11-25 18:30:22', '0.00'),
(11, 3, 1, 1, '2025-11-22', '11:00:00', 'completed', '2025-11-25 18:30:22', '2025-11-25 18:30:22', '0.00'),
(12, 8, 7, 2, '2025-11-26', '09:00:00', 'confirmed', '2025-11-25 18:33:24', '2025-11-25 18:34:53', '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `created_at`) VALUES
(1, 'John Smith', 'john.smith@email.com', '555-0101', '2025-11-25 04:39:04'),
(2, 'Emma Johnson', 'emma.j@email.com', '555-0102', '2025-11-25 04:39:04'),
(3, 'Michael Brown', 'michael.b@email.com', '555-0103', '2025-11-25 04:39:04'),
(4, 'Sophia Davis', 'sophia.d@email.com', '555-0104', '2025-11-25 04:39:04'),
(5, 'James Wilson', 'james.w@email.com', '555-0105', '2025-11-25 04:39:04'),
(6, 'Muhammad Tayyab', 't@gmail.com', '23456789', '2025-11-25 04:54:28'),
(7, 'Mateen Hamza', 'mt@gmail.com', '7654-9763', '2025-11-25 17:46:17'),
(8, 'Shoaib Taqawal', 's@gmail.com', '7954-9963', '2025-11-25 18:33:24');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'Duration in minutes',
  `icon` varchar(50) DEFAULT 'cut',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `price`, `duration`, `icon`, `created_at`) VALUES
(1, 'Haircut', 'Professional haircut with styling', '45.00', 45, 'cut', '2025-11-25 04:39:04'),
(2, 'Hair Coloring', 'Full hair coloring service', '120.00', 120, 'spray-can', '2025-11-25 04:39:04'),
(3, 'Manicure', 'Complete nail care and polish', '35.00', 60, 'hand-sparkles', '2025-11-25 04:39:04'),
(4, 'Pedicure', 'Relaxing foot care and polish', '45.00', 60, 'spa', '2025-11-25 04:39:04'),
(5, 'Facial Treatment', 'Deep cleansing facial', '80.00', 90, 'face-smile', '2025-11-25 04:39:04'),
(6, 'Hair Styling', 'Special event hair styling', '65.00', 60, 'paint-brush', '2025-11-25 04:39:04'),
(7, 'Hair Cutting', 'We have a professional hair cutters', '25.00', 25, 'cut', '2025-11-25 04:45:17');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `position`, `email`, `phone`, `created_at`) VALUES
(1, 'Sarah Martinez', 'Senior Stylist', 'sarah.m@salon.com', '555-1001', '2025-11-25 04:39:04'),
(2, 'David Lee', 'Hair Colorist', 'david.l@salon.com', '555-1002', '2025-11-25 04:39:04'),
(3, 'Lisa Chen', 'Nail Technician', 'lisa.c@salon.com', '555-1003', '2025-11-25 04:39:04'),
(4, 'Robert Taylor', 'Stylist', 'robert.t@salon.com', '555-1004', '2025-11-25 04:39:04'),
(5, 'Awais haider', 'Cutter', 'aw@gmail.com', '674245789', '2025-11-25 07:33:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
