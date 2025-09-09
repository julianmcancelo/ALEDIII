-- Agregar columna legajo a la tabla usuarios
-- Esta columna almacenará el número de legajo para estudiantes y profesores

ALTER TABLE usuarios 
ADD COLUMN legajo VARCHAR(20) NULL AFTER dni;

-- Crear índice para optimizar búsquedas por legajo
ALTER TABLE usuarios 
ADD INDEX idx_legajo (legajo);
