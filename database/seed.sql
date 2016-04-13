USE studex;

DELETE FROM class;
DELETE FROM student_class;
DELETE FROM teacher;
DELETE FROM student;

ALTER TABLE teacher AUTO_INCREMENT = 1;
ALTER TABLE student AUTO_INCREMENT = 1;


-- TEACHER SEED
INSERT INTO teacher(email, password, first_name, middle_initial,last_name) \
    VALUES("kpbautista@up.edu.ph", PASSWORD(CONCAT(MD5("tintin"), "q5cH9VoL")), \
   	"Kristine Elaine", "P", "Bautista");


-- STUDENT SEED
INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("armontoya@up.edu.ph","2013-68013","Anne Kristine","R","Montoya","haruhi.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("atmendoza@up.edu.ph","2013-74812","Almer","T","Mendoza","mamer.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("jjadaoag@up.edu.ph","2013-12164","Joseph Gabriel","J","Adaoag","adaoag.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("gepadernos@up.edu.ph","2013-31543","Gianni Diorella","E","Padernos","yanni.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("ebconstantino@up.edu.ph","2013-86033","Emmanual Jr.","B","Constantino","mj.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("pmquizon@up.edu.ph","2013-94124","Pia Carmela","M","Quiz","pia.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("jamanalo@up.edu.ph","2013-98325","Joshua David","A","Manalo","manalo.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("naedora@up.edu.ph","2013-43261","Nixon Jr.","A","Edora","nixon.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("dgmacusi@up.edu.ph","2013-31456","Daniellika","G","Macusi","lyka.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("matthewqcabailo@gmail.com","2013-81252","Matthew","Q","Cabailo","matthew.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("zepf.uplb@gmail.com","2013-74513","Franz Joezepf","C","Dinglasan","franz.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("camilleshainne@gmail.com","2013-34890","Camille Shainne","F","Dalisay","shai.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("jcarlo.quintos@gmail.com","2013-43571","JC Carlo","DG","Quintos","jc.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("nurfitrajaafar@gmail.com","2013-34261","Nurfitra","A","Jaafar","nur.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("mark.javerina@gmail.com","2013-53421","Mark","J","Javerina","mark.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("barramedasimon321@gmail.com","2013-09812","Simon","C","Barrameda","simon.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("cyquiz@up.edu.ph","2013-68103","Charlene","Y","Quiz","charlene.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("jfsergio@up.edu.ph","2013-43511","John Rey","F","Sergio","serg.jpg");

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)\
		VALUES("kbpios@up.edu.ph","2013-13571","Karl Jasson","B","Pios","pios.jpg");


-- CLASS SEED
INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-6L","1");


-- STUDENT_CLASS SEED
INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","1","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","2","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","3","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","4","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","5","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","6","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","7","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","8","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","9","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","10","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","11","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","12","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","13","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","14","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","15","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","16","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","17","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","18","1");

INSERT INTO student_class(class_id, student_id, times_called)\
		VALUES("1","19","1");
