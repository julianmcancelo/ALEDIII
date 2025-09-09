-- Script para verificar y agregar constraint si no existe
-- Maneja el caso donde la columna profesor_id ya existe pero falta el constraint

-- Verificar si existe el constraint
SET @constraint_exists = (
    SELECT COUNT(*)
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_NAME = 'materias' 
    AND TABLE_SCHEMA = DATABASE()
    AND CONSTRAINT_NAME = 'fk_materias_profesor'
);

-- Solo agregar el constraint si no existe
SET @sql = IF(@constraint_exists = 0,
    'ALTER TABLE materias ADD CONSTRAINT fk_materias_profesor FOREIGN KEY (profesor_id) REFERENCES usuarios(id) ON DELETE SET NULL',
    'SELECT "Constraint fk_materias_profesor ya existe" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índice si no existe
CREATE INDEX IF NOT EXISTS idx_materias_profesor ON materias(profesor_id);
