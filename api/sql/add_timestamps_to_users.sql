-- Agregar las columnas created_at y updated_at a la tabla usuarios

DELIMITER //

CREATE PROCEDURE AddTimestampColumnsIfNotExists()
BEGIN
    -- Add created_at column
    IF NOT EXISTS(
        SELECT * FROM information_schema.columns
        WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE `usuarios` ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Add updated_at column
    IF NOT EXISTS(
        SELECT * FROM information_schema.columns
        WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE `usuarios` ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
    END IF;
END//

DELIMITER ;

CALL AddTimestampColumnsIfNotExists();

DROP PROCEDURE AddTimestampColumnsIfNotExists;
