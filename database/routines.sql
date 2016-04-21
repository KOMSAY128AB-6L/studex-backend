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
