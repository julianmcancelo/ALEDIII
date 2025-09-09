-- Eliminar la columna 'especialidad' de la tabla 'usuarios' si existe.

DELIMITER //

CREATE PROCEDURE RemoveEspecialidadColumnIfExists()
BEGIN
    IF EXISTS(
        SELECT * FROM information_schema.columns
        WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'especialidad'
    ) THEN
        ALTER TABLE `usuarios` DROP COLUMN `especialidad`;
    END IF;
END//

DELIMITER ;

CALL RemoveEspecialidadColumnIfExists();

DROP PROCEDURE RemoveEspecialidadColumnIfExists;
