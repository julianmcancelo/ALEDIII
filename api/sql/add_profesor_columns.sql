-- Script para agregar columnas especialidad y departamento a tabla usuarios
-- Solo las agrega si no existen

-- Verificar y agregar columna especialidad
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS 
    WHERE TABLE_NAME = 'usuarios' 
    AND TABLE_SCHEMA = DATABASE()
    AND COLUMN_NAME = 'especialidad'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE usuarios ADD COLUMN especialidad VARCHAR(100) NULL AFTER email',
    'SELECT "Columna especialidad ya existe" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar y agregar columna departamento
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS 
    WHERE TABLE_NAME = 'usuarios' 
    AND TABLE_SCHEMA = DATABASE()
    AND COLUMN_NAME = 'departamento'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE usuarios ADD COLUMN departamento VARCHAR(100) NULL AFTER especialidad',
    'SELECT "Columna departamento ya existe" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar y agregar columna telefono si no existe
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS 
    WHERE TABLE_NAME = 'usuarios' 
    AND TABLE_SCHEMA = DATABASE()
    AND COLUMN_NAME = 'telefono'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20) NULL AFTER departamento',
    'SELECT "Columna telefono ya existe" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Mostrar estructura final
DESCRIBE usuarios;
