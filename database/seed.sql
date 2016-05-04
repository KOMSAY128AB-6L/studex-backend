USE studex;

DELETE FROM history;
DELETE FROM student_tag;
DELETE FROM volunteer_student;
DELETE FROM volunteer;
DELETE FROM student;
DELETE FROM class;
DELETE FROM teacher;

ALTER TABLE teacher AUTO_INCREMENT = 1;
ALTER TABLE student AUTO_INCREMENT = 1;
ALTER TABLE class AUTO_INCREMENT = 1;
ALTER TABLE volunteer AUTO_INCREMENT = 1;
ALTER TABLE volunteer_student AUTO_INCREMENT = 1;
ALTER TABLE history AUTO_INCREMENT = 1;
ALTER TABLE student_tag AUTO_INCREMENT = 1;




-- TEACHER SEED
INSERT INTO teacher(email, password, first_name, middle_initial,last_name, picture) \
    VALUES("kpbautista@up.edu.ph", PASSWORD(CONCAT(MD5("tintin"), "q5cH9VoL")), \
   	"Kristine Elaine", "P", "Bautista", "kep.jpg");

INSERT INTO teacher(email, password, first_name, middle_initial,last_name, picture) \
    VALUES("lrlactuan@up.edu.ph", PASSWORD(CONCAT(MD5("lei"), "q5cH9VoL")), \
   	"Lei Kristofer","R","Lactuan","lei.jpg");

INSERT INTO teacher(email, password, first_name, middle_initial,last_name, picture) \
    VALUES("mbderobles@up.edu.ph", PASSWORD(CONCAT(MD5("betel"), "q5cH9VoL")), \
   	"Marie Betel", "B", "De Robles", "betel.jpg");

INSERT INTO teacher(email, password, first_name, middle_initial,last_name, picture) \
    VALUES("rcrecario@up.edu.ph", PASSWORD(CONCAT(MD5("reg"), "q5cH9VoL")), \
   	"Reginald Neil","C","Recario","reg.jpg");

-- CLASS SEED
INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-1L",1);

INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-2L",2);

INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-3L",3);

INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-4L",4);

INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-5L",2);

INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-4L",1);

INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-7L",3);

-- STUDENT SEED
INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("armontoya@up.edu.ph","2013-48013","Anne Kristine","R","Montoya","haruhi.jpg", 3);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("atmendoza@up.edu.ph","2013-73812","Almer","T","Mendoza","mamer.jpg", 3);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("jjadaoag@up.edu.ph","2013-12133","Joseph Gabriel","J","Adaoag","adaoag.jpg", 3);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("gepadernos@up.edu.ph","2013-31533","Gianni Diorella","E","Padernos","yanni.jpg", 3);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("ebconstantino@up.edu.ph","2013-83033","Emmanual Jr.","B","Constantino","mj.jpg", 3);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("pmquizon@up.edu.ph","2013-93123","Pia Carmela","M","Quiz","pia.jpg", 3);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("jamanalo@up.edu.ph","2013-98325","Joshua David","A","Manalo","manalo.jpg", 2);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("naedora@up.edu.ph","2013-23221","Nixon Jr.","A","Edora","nixon.jpg", 2);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("dgmacusi@up.edu.ph","2013-31252","Daniellika","G","Macusi","lyka.jpg", 2);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("matthewqcabailo@gmail.com","2013-81252","Matthew","Q","Cabailo","matthew.jpg", 2);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("zepf.uplb@gmail.com","2013-72513","Franz Joezepf","C","Dinglasan","franz.jpg", 2);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("camilleshainne@gmail.com","2013-32890","Camille Shainne","F","Dalisay","shai.jpg", 1);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("jcarlo.quintos@gmail.com","2013-13571","JC Carlo","DG","Quintos","jc.jpg", 1);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("nurfitrajaafar@gmail.com","2013-31211","Nurfitra","A","Jaafar","nur.jpg", 1);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("mark.javerina@gmail.com","2013-53121","Mark","J","Javerina","mark.jpg", 1);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("barramedasimon321@gmail.com","2013-09812","Simon","C","Barrameda","simon.jpg", 1);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("cyquiz@up.edu.ph","2013-18103","Charlene","Y","Quiz","charlene.jpg", 1);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("jfsergio@up.edu.ph","2013-43511","John Rey","F","Sergio","serg.jpg", 4);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("kbpios@up.edu.ph","2013-32142","Karl Jasson","B","Pios","pios.jpg", 4);


-- VOLUNTEER seed
INSERT INTO volunteer(teacher_id, class_id, volunteer_date) VALUES("4", "4", curdate());
INSERT INTO volunteer(teacher_id, class_id, volunteer_date) VALUES("1", "1", curdate());

-- Add Student to Volunteers
INSERT INTO volunteer_student(student_id, volunteer_id) VALUES("19", "1");
INSERT INTO volunteer_student(student_id, volunteer_id) VALUES("18", "1");
INSERT INTO volunteer_student(student_id, volunteer_id) VALUES("17", "2");
INSERT INTO volunteer_student(student_id, volunteer_id) VALUES("16", "2");
INSERT INTO volunteer_student(student_id, volunteer_id) VALUES("15", "2");

-- HISTORY seed
INSERT INTO history(teacher_id, log_text) VALUES(1, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(1, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(1, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(1, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(2, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(2, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(2, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(3, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(3, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(3, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(3, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(3, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(4, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(4, "Sample text");
INSERT INTO history(teacher_id, log_text) VALUES(4, "Sample text");
