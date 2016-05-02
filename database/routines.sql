USE studex;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ADD_CLASS`(_className VARCHAR(255), _sectionName VARCHAR(255), _teacherId INT(10))
BEGIN
    IF NOT EXISTS (
        SELECT  class_name, section
        FROM    class WHERE class_name = _className AND section = _sectionName AND teacher_id = _teacherId
    ) THEN
        INSERT INTO class (class_name, section, teacher_id)
        VALUES (_className, _sectionName, _teacherId);
    END IF;
END ;;
DELIMITER ;

DROP FUNCTION IF EXISTS GET_VOLUNTEER_COUNT;
DELIMITER ;;
CREATE FUNCTION `GET_VOLUNTEER_COUNT`(_student_id INT) RETURNS INT
    READS SQL DATA
BEGIN
    DECLARE _count INT DEFAULT 0;

    SELECT COUNT(*) INTO _count FROM volunteer_student where student_id = _student_id;

    RETURN _count;
END ;;
DELIMITER ;
