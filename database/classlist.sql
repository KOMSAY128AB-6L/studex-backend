use studex;

INSERT INTO class ("class_name", "section", "teacher_id") VALUES ('CMSC 128','AB-1L',5);

INSERT INTO student ("email", "password", "first_name", "middle_initial", "last_name", "picture") VALUES ('dummy@dummy.dum','Dummer','D','Dumdum','/public/image.img');
INSERT INTO student_class ("class_id", "student_id") VALUES ((SELECT class_id FROM class WHERE class_name='CMSC 128',),(SELECT student_id FROM student WHERE email='dummy@dummy.dum'));

INSERT INTO student ("email", "password", "first_name", "middle_initial", "last_name", "picture") VALUES ('cornik@corn.com','Corner','C','Girlygurl','/public/corn.img');
INSERT INTO student_class ("class_id", "student_id") VALUES ((SELECT class_id FROM class WHERE class_name='CMSC 128',),(SELECT student_id FROM student WHERE email='cornik@corn.com'));

INSERT INTO class ("class_name", "section", "teacher_id") VALUES ('CMSC 128','AB-2L',5);

INSERT INTO student ("email", "password", "first_name", "middle_initial", "last_name", "picture") VALUES ('dummy@dummy.dum','Dummer','D','Dumdum','/public/image.img');
INSERT INTO student_class ("class_id", "student_id") VALUES ((SELECT class_id FROM class WHERE class_name='CMSC 128',),(SELECT student_id FROM student WHERE email='dummy@dummy.dum'));

INSERT INTO student ("email", "password", "first_name", "middle_initial", "last_name", "picture") VALUES ('umaloka@perry.platy','Lulu','X','Kornerme','/public/corner.img');
INSERT INTO student_class ("class_id", "student_id") VALUES ((SELECT class_id FROM class WHERE class_name='CMSC 128',),(SELECT student_id FROM student WHERE email='umaloka@perry.platy'));

