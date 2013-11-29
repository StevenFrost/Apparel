-- phpMyAdmin SQL Dump
-- version 3.3.8
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 29, 2013 at 11:27 PM
-- Server version: 5.1.46
-- PHP Version: 5.3.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

DROP TABLE IF EXISTS `G51WPS_Customers`;
CREATE TABLE IF NOT EXISTS `G51WPS_Customers` (
  `cID` int(11) NOT NULL AUTO_INCREMENT,
  `cTitle` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `cForename` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cSurname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cEmail` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `cHouse` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cRoad` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `cStreet` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cCity` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `cCounty` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `cPostcode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`cID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0 ;

DROP TABLE IF EXISTS `G51WPS_Orders`;
CREATE TABLE IF NOT EXISTS `G51WPS_Orders` (
  `oID` int(11) NOT NULL AUTO_INCREMENT,
  `cID` int(11) NOT NULL,
  `oShirtColour` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `oLogoName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `oLogoSize` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `oHorizontalAlign` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `oTopText` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `oTopAttributes` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `oBottomText` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `oBottomAttributes` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `oNumSmall` int(11) NOT NULL DEFAULT '0',
  `oNumMedium` int(11) NOT NULL DEFAULT '0',
  `oNumLarge` int(11) NOT NULL DEFAULT '0',
  `oNumXLarge` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`oID`),
  KEY `cID` (`cID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0 ;

ALTER TABLE `G51WPS_Orders`
  ADD CONSTRAINT `G51WPS_Orders_ibfk_1` FOREIGN KEY (`cID`) REFERENCES `G51WPS_Customers` (`cID`) ON DELETE CASCADE ON UPDATE CASCADE;
