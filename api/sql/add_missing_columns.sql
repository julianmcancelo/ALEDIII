-- Agregar campos faltantes a la tabla usuarios de forma segura
-- Solo agrega los campos si no existen

-- Agregar campo dni
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'dni' AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE usuarios ADD COLUMN dni VARCHAR(20) NULL AFTER password_hash',
    'SELECT "Campo dni ya existe" as mensaje'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar campo carrera
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'carrera' AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE usuarios ADD COLUMN carrera VARCHAR(100) NULL AFTER dni',
    'SELECT "Campo carrera ya existe" as mensaje'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar campo especialidad
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'especialidad' AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE usuarios ADD COLUMN especialidad VARCHAR(100) NULL AFTER carrera',
    'SELECT "Campo especialidad ya existe" as mensaje'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar campo telefono
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'telefono' AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20) NULL AFTER especialidad',
    'SELECT "Campo telefono ya existe" as mensaje'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar campo departamento
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'departamento' AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE usuarios ADD COLUMN departamento ENUM("Dirección", "Secretaría", "Administración", "Sistemas") NULL AFTER telefono',
    'SELECT "Campo departamento ya existe" as mensaje'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
