import MySQLdb
db = MySQLdb.connect(user = 'root', passwd = '', db = 'studex')

cursor = db.cursor()

cursor.execute("DELETE FROM class")
cursor.execute("""DELETE FROM student_class""")
cursor.execute("""DELETE FROM teacher""")
cursor.execute("""DELETE FROM student""")
cursor.execute("""ALTER TABLE teacher AUTO_INCREMENT = 1;""")
cursor.execute("""ALTER TABLE student AUTO_INCREMENT = 1;""")



cursor.executemany(
     """INSERT INTO teacher(email, password, first_name, middle_initial,last_name, picture) \
                 VALUES(%s, PASSWORD(CONCAT(MD5(%s), %s)), %s, %s, %s)""",
      	[
	    	("kpbautista@up.edu.ph", "tintin", "q5cH9VoL",
	    		"Kristine Elaine", "P", "Bautista", "kep.jpg"),
	    	("lrlactuan@up.edu.ph","lei", "q5cH9VoL",
	    		"Lei Kristofer","R","Lactuan","lei.jpg"),
	    	("mbderobles@up.edu.ph", "betel", "q5cH9VoL", 
	    		"Marie Betel", "B", "De Robles", "betel.jpg"),
	    	("rcrecario@up.edu.ph","reg", "q5cH9VoL",
	    		"Reginald Neil","C","Recario","reg.jpg")
       	] 
)

cursor.executemany(
    """INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)
      	VALUES (%s, %s, %s, %s, %s, %s)""",
      	[
	    	("armontoya@up.edu.ph","2013-68013","Anne Kristine","R","Montoya","haruhi.jpg"),
	    	("atmendoza@up.edu.ph","2013-74812","Almer","T","Mendoza","mamer.jpg"),
	    	("jjadaoag@up.edu.ph","2013-12164","Joseph Gabriel","J","Adaoag","adaoag.jpg"),
	    	("gepadernos@up.edu.ph","2013-31543","Gianni Diorella","E","Padernos","yanni.jpg"),
	    	("ebconstantino@up.edu.ph","2013-86033","Emmanual Jr.","B","Constantino","mj.jpg"),
	    	("pmquizon@up.edu.ph","2013-94124","Pia Carmela","M","Quiz","pia.jpg"),
	    	("jamanalo@up.edu.ph","2013-98325","Joshua David","A","Manalo","manalo.jpg"),
	    	("naedora@up.edu.ph","2013-43261","Nixon Jr.","A","Edora","nixon.jpg"),
	    	("dgmacusi@up.edu.ph","2013-31456","Daniellika","G","Macusi","lyka.jpg"),
	    	("matthewqcabailo@gmail.com","2013-81252","Matthew","Q","Cabailo","matthew.jpg"),
	    	("zepf.uplb@gmail.com","2013-74513","Franz Joezepf","C","Dinglasan","franz.jpg"),
	    	("camilleshainne@gmail.com","2013-34890","Camille Shainne","F","Dalisay","shai.jpg"),
	    	("jcarlo.quintos@gmail.com","2013-43571","JC Carlo","DG","Quintos","jc.jpg"),
	    	("nurfitrajaafar@gmail.com","2013-34261","Nurfitra","A","Jaafar","nur.jpg"),
	    	("mark.javerina@gmail.com","2013-53421","Mark","J","Javerina","mark.jpg"),
	    	("barramedasimon321@gmail.com","2013-09812","Simon","C","Barrameda","simon.jpg"),
	    	("cyquiz@up.edu.ph","2013-68103","Charlene","Y","Quiz","charlene.jpg"),
	    	("jfsergio@up.edu.ph","2013-43511","John Rey","F","Sergio","serg.jpg"),
	    	("kbpios@up.edu.ph","2013-13571","Karl Jasson","B","Pios","pios.jpg")
      	] 
)


cursor.executemany(
    """INSERT INTO class(class_name, section, teacher_id)
      	VALUES (%s, %s, %s)""",
      	[
	    	("CMSC 128","AB-1L",1),
	    	("CMSC 128","AB-2L",2),
	    	("CMSC 128","AB-3L",3),
	    	("CMSC 128","AB-4L",4),
	    	("CMSC 128","AB-5L",2),
	    	("CMSC 128","AB-6L",1),
	    	("CMSC 128","AB-7L",3)
      	] 
)

cursor.executemany(
    """INSERT INTO student_class(class_id, student_id, times_called)
	     	VALUES (%s, %s, %s)""",
      	[
	    	("6","1","1"),
	    	("6","2","1"),
	    	("6","3","1"),
	    	("6","4","1"),
	    	("6","5","1"),
	    	("6","6","1"),
	    	("6","7","1"),
	    	("6","8","1"),
	    	("6","9","1"),
	    	("6","10","1"),
	    	("6","11","1"),
	    	("6","12","1"),
	    	("6","13","1"),
	    	("6","14","1"),
	    	("6","15","1"),
	    	("6","16","1"),
	    	("6","17","1"),
	    	("6","18","1"),
	    	("6","19","1")
     	] 
)

db.commit();
db.close();