/**
	@rules
		all caps on mysql keywords
		use plural form on table names
		snake case everywhere
		use DATETIME type for dates
		start the column name with `date_` IF type is DATETIME, e.g. `date_created`, `date_updated`, `date_expiration`
		use VARCHAR(37) as primary key for ID's exposed to the user
		use INT(11) AUTO_INCREMENT as primary key for ID's not exposed to the user
		use the proper mysql engine Innodb or MyISAM
		mind the column charset and table collation
		all tables should have an id (PRIMARY KEY), date_created and date_updated
			*table id will follow the this format :
				`<singular form of table_name>_id` PRIMARY KEY VARCHAR(32) or INT(11) AUTO_INCREMENT
		see sample below:
*/



DROP DATABASE IF EXISTS studex;
CREATE DATABASE studex;

USE studex;

CREATE TABLE IF NOT EXISTS teacher (
	teacher_id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(64) UNIQUE,
	password VARCHAR(128) NOT NULL,
	first_name VARCHAR(64) NOT NULL,
	middle_initial VARCHAR(4) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	picture VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS class (
	class_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	class_name VARCHAR(128) NOT NULL,
	section VARCHAR(32) NOT NULL,
	teacher_id INT,
	FOREIGN KEY(teacher_id) REFERENCES teacher(teacher_id)
);

CREATE TABLE IF NOT EXISTS student (
	student_id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(64) UNIQUE,
	student_number VARCHAR(10) UNIQUE,
	first_name VARCHAR(64) NOT NULL,
	middle_initial VARCHAR(4) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	picture VARCHAR(64),
	class_id BIGINT,
	FOREIGN KEY(class_id) REFERENCES class(class_id)
);

CREATE TABLE IF NOT EXISTS volunteer (
	volunteer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	teacher_id INT,
	class_id BIGINT,
	volunteer_date DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(teacher_id) REFERENCES teacher(teacher_id),
	FOREIGN KEY(class_id) REFERENCES class(class_id)
);

CREATE TABLE IF NOT EXISTS volunteer_student (
	student_id INT,
	volunteer_id BIGINT,
	PRIMARY KEY(student_id, volunteer_id),
	FOREIGN KEY(student_id) REFERENCES student(student_id)
);


CREATE TABLE IF NOT EXISTS reset_password (
	email VARCHAR(64) PRIMARY KEY,
	random_string VARCHAR(64) NOT NULL,
	date_expiry DATETIME DEFAULT NULL
);

CREATE TRIGGER before_insert_on_reset_password BEFORE INSERT ON `reset_password`
FOR EACH ROW SET new.date_expiry = IFNULL(new.date_expiry,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY));

SET GLOBAL log_output = 'TABLE';
SET GLOBAL general_log = 'ON';

CREATE TABLE IF NOT EXISTS history (
	log_id INT AUTO_INCREMENT PRIMARY KEY,
	log_time timestamp NOT NULL default CURRENT_TIMESTAMP,
	teacher_id INT, log_text VARCHAR(255),
	FOREIGN KEY(teacher_id) REFERENCES teacher(teacher_id)
);
