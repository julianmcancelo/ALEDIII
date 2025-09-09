-- Agregar todos los campos de estudiante faltantes a la tabla usuarios de forma segura
-- Solo agrega los campos si no existen

DELIMITER //

CREATE PROCEDURE AddColumnIfNotExists(IN tableName VARCHAR(64), IN colName VARCHAR(64), IN colDef TEXT)
BEGIN
    SET @dbName = DATABASE();
    IF NOT EXISTS(
        SELECT * FROM information_schema.columns
        WHERE table_schema = @dbName
        AND table_name = tableName
        AND column_name = colName
    ) THEN
        SET @ddl = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', colName, ' ', colDef);
        PREPARE stmt FROM @ddl;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//

DELIMITER ;

-- Campos Personales
CALL AddColumnIfNotExists('usuarios', 'apellidos', 'VARCHAR(255) NULL AFTER name');
CALL AddColumnIfNotExists('usuarios', 'fechaNacimiento', 'DATE NULL AFTER apellidos');

-- Campos Académicos
CALL AddColumnIfNotExists('usuarios', 'legajo', 'VARCHAR(50) NULL UNIQUE AFTER dni');
CALL AddColumnIfNotExists('usuarios', 'fechaInscripcion', 'DATE NULL AFTER carrera');
CALL AddColumnIfNotExists('usuarios', 'estado', 'ENUM("activo", "inactivo", "graduado") NOT NULL DEFAULT "activo" AFTER fechaInscripcion');

-- Dirección
CALL AddColumnIfNotExists('usuarios', 'calle', 'VARCHAR(255) NULL AFTER departamento');
CALL AddColumnIfNotExists('usuarios', 'ciudad', 'VARCHAR(100) NULL AFTER calle');
CALL AddColumnIfNotExists('usuarios', 'provincia', 'VARCHAR(100) NULL AFTER ciudad');
CALL AddColumnIfNotExists('usuarios', 'codigoPostal', 'VARCHAR(20) NULL AFTER provincia');

-- Contacto de Emergencia
CALL AddColumnIfNotExists('usuarios', 'contacto_emergencia_nombre', 'VARCHAR(255) NULL AFTER codigoPostal');
CALL AddColumnIfNotExists('usuarios', 'contacto_emergencia_telefono', 'VARCHAR(50) NULL AFTER contacto_emergencia_nombre');
CALL AddColumnIfNotExists('usuarios', 'contacto_emergencia_parentesco', 'VARCHAR(50) NULL AFTER contacto_emergencia_telefono');

DROP PROCEDURE AddColumnIfNotExists;
