USE studex;

DELETE FROM class;
DELETE FROM teacher;
DELETE FROM student;
DELETE FROM volunteer;

ALTER TABLE teacher AUTO_INCREMENT = 1;
ALTER TABLE student AUTO_INCREMENT = 1;
ALTER TABLE class AUTO_INCREMENT = 1;


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
		VALUES("CMSC 128","AB-6L",1);

INSERT INTO class(class_name, section, teacher_id)\
		VALUES("CMSC 128","AB-7L",3);

-- STUDENT SEED
INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("armontoya@up.edu.ph","2013-68013","Anne Kristine","R","Montoya","haruhi.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("atmendoza@up.edu.ph","2013-74812","Almer","T","Mendoza","mamer.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("jjadaoag@up.edu.ph","2013-12164","Joseph Gabriel","J","Adaoag","adaoag.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("gepadernos@up.edu.ph","2013-31543","Gianni Diorella","E","Padernos","yanni.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("ebconstantino@up.edu.ph","2013-86033","Emmanual Jr.","B","Constantino","mj.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("pmquizon@up.edu.ph","2013-94124","Pia Carmela","M","Quiz","pia.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("jamanalo@up.edu.ph","2013-98325","Joshua David","A","Manalo","manalo.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("naedora@up.edu.ph","2013-43261","Nixon Jr.","A","Edora","nixon.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("dgmacusi@up.edu.ph","2013-31456","Daniellika","G","Macusi","lyka.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("matthewqcabailo@gmail.com","2013-81252","Matthew","Q","Cabailo","matthew.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("zepf.uplb@gmail.com","2013-74513","Franz Joezepf","C","Dinglasan","franz.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("camilleshainne@gmail.com","2013-34890","Camille Shainne","F","Dalisay","shai.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("jcarlo.quintos@gmail.com","2013-43571","JC Carlo","DG","Quintos","jc.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("nurfitrajaafar@gmail.com","2013-34261","Nurfitra","A","Jaafar","nur.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("mark.javerina@gmail.com","2013-53421","Mark","J","Javerina","mark.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("barramedasimon321@gmail.com","2013-09812","Simon","C","Barrameda","simon.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("cyquiz@up.edu.ph","2013-68103","Charlene","Y","Quiz","charlene.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("jfsergio@up.edu.ph","2013-43511","John Rey","F","Sergio","serg.jpg", 6);

INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)\
		VALUES("kbpios@up.edu.ph","2013-13571","Karl Jasson","B","Pios","pios.jpg", 6);


-- VOLUNTEER seed
INSERT INTO volunteer(student_id, teacher_id, class_id, volunteer_date) VALUES("1", "1", "6", curdate());

INSERT INTO volunteer(student_id, teacher_id, class_id, volunteer_date) VALUES("4","1","6",curdate());

INSERT INTO volunteer(student_id, teacher_id, class_id, volunteer_date) VALUES("15","1","6",curdate());

INSERT INTO volunteer(student_id, teacher_id, class_id, volunteer_date) VALUES("18","3","3",curdate());

INSERT INTO volunteer(student_id, teacher_id, class_id, volunteer_date) VALUES("11","2","5", curdate());

