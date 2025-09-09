-- Agregar columna profesor_id a la tabla materias
-- Permite asignar un profesor a cada materia

ALTER TABLE materias 
ADD COLUMN profesor_id VARCHAR(36) NULL AFTER carrera_id,
ADD CONSTRAINT fk_materias_profesor 
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id) 
    ON DELETE SET NULL;

-- Crear índice para mejorar performance en consultas
CREATE INDEX idx_materias_profesor ON materias(profesor_id);

-- Comentario sobre la relación
-- profesor_id es NULL cuando la materia no tiene profesor asignado
-- La FK permite que solo usuarios con rol 'profesor' sean asignados
