-- Agregar la columna 'role' a la tabla 'usuarios' si no existe.

DELIMITER //

CREATE PROCEDURE AddRoleColumnIfNotExists()
BEGIN
    IF NOT EXISTS(
        SELECT * FROM information_schema.columns
        WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'role'
    ) THEN
        ALTER TABLE `usuarios` ADD COLUMN `role` ENUM('admin', 'student', 'profesor') NOT NULL DEFAULT 'student' AFTER `apellidos`;
    END IF;
END//

DELIMITER ;

CALL AddRoleColumnIfNotExists();

DROP PROCEDURE AddRoleColumnIfNotExists;
