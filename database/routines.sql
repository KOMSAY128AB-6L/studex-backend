use studex;

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
