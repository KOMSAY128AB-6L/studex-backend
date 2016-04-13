use studex;

INSERT INTO class (class_name, section, teacher_id) VALUES ('CMSC 128','AB-1L',1);

INSERT INTO student (email, first_name, middle_initial, last_name, picture) VALUES ('ategurl16@dummy.dum','Dummer','D','Dumdum','/public/image.img');
INSERT INTO student_class (class_id, student_id) VALUES ((SELECT class_id FROM class WHERE section='AB-1L' LIMIT 1),(SELECT student_id FROM student WHERE email='ategurl16@dummy.dum' LIMIT 1));

INSERT INTO student (email, first_name, middle_initial, last_name, picture) VALUES ('cornik16@corn.com','Corner','C','Girlygurl','/public/corn.img');
INSERT INTO student_class (class_id, student_id) VALUES ((SELECT class_id FROM class WHERE section='AB-1L' LIMIT 1),(SELECT student_id FROM student WHERE email='cornik16@corn.com' LIMIT 1));

INSERT INTO class (class_name, section, teacher_id) VALUES ('CMSC 128','AB-2L',1);

INSERT INTO student (email, first_name, middle_initial, last_name, picture) VALUES ('dummy16@dummy.dum','Dummer','D','Dumdum','/public/image.img');
INSERT INTO student_class (class_id, student_id) VALUES ((SELECT class_id FROM class WHERE section='AB-2L' LIMIT 1),(SELECT student_id FROM student WHERE email='dummy16@dummy.dum' LIMIT 1));

INSERT INTO student (email, first_name, middle_initial, last_name, picture) VALUES ('umaloka16@perry.platy','Lulu','X','Kornerme','/public/corner.img');
INSERT INTO student_class (class_id, student_id) VALUES ((SELECT class_id FROM class WHERE section='AB-2L' LIMIT 1),(SELECT student_id FROM student WHERE email='umaloka16@perry.platy' LIMIT 1));

