use studex;


INSERT INTO class (class_name, section, teacher_id) VALUES ('CMSC123','AB-2L',1) WHERE NOT EXISTS (SELECT * FROM class WHERE class_name = 'CMSC123' AND section = 'AB-2L');
INSERT INTO student (email, first_name, middle_initial, last_name, picture, class_id) VALUES ('atmalmer101331@e.com','almer','t','mendoza','/picture1', (SELECT * FROM class WHERE class_name = 'AB-2L')) WHERE NOT EXISTS (SELECT * FROM student WHERE email = 'atmalmer101331@e.com');
INSERT INTO student (email, first_name, middle_initial, last_name, picture, class_id) VALUES ('atmToo31131@e.com','ooga','y','abakada','/picture2', (SELECT * FROM class WHERE class_name = 'AB-2L')) WHERE NOT EXISTS (SELECT * FROM student WHERE email = 'atmToo31131@e.com');
INSERT INTO student (email, first_name, middle_initial, last_name, picture, class_id) VALUES ('girly3131@e.com','girly','x','liadsa','/picture3', (SELECT * FROM class WHERE class_name = 'AB-2L')) WHERE NOT EXISTS (SELECT * FROM student WHERE email = 'girly3131@e.com');
INSERT INTO student (email, first_name, middle_initial, last_name, picture, class_id) VALUES ('heyy13131o@e.com','heyyo','z','humama','/picture4', (SELECT * FROM class WHERE class_name = 'AB-2L')) WHERE NOT EXISTS (SELECT * FROM student WHERE email = 'heyy13131o@e.com');

INSERT INTO class (class_name, section, teacher_id) VALUES ('CMSC123','AB-1L',1) WHERE NOT EXISTS (SELECT * FROM class WHERE class_name = 'CMSC123' AND section = 'AB-1L');
INSERT INTO student (email, first_name, middle_initial, last_name, picture, class_id) VALUES ('a3133131231@e.com','a','a','a','/a', (SELECT * FROM class WHERE class_name = 'AB-1L')) WHERE NOT EXISTS (SELECT * FROM student WHERE email = 'a3133131231@e.com');
