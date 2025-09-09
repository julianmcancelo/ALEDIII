-- Refactoriza el campo `carrera` a `carrera_id` con una clave foránea a la tabla `carreras`

-- Paso 1: Renombrar la columna existente para no perder datos (si existe)
SET @sql = (SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'carrera'),
    'ALTER TABLE usuarios CHANGE COLUMN carrera carrera_nombre VARCHAR(100) NULL',
    'SELECT "La columna `carrera` no existe, no se renombra." AS msg;'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Paso 2: Agregar la nueva columna `carrera_id` (si no existe)
SET @sql = (SELECT IF(
    NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'carrera_id'),
    'ALTER TABLE usuarios ADD COLUMN carrera_id VARCHAR(36) NULL AFTER legajo',
    'SELECT "La columna `carrera_id` ya existe." AS msg;'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Paso 3: Migrar los datos de `carrera_nombre` a `carrera_id`
SET @sql = (SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'carrera_nombre'),
    'UPDATE usuarios u JOIN carreras c ON u.carrera_nombre = c.nombre SET u.carrera_id = c.id WHERE u.carrera_id IS NULL',
    'SELECT "No hay datos que migrar." AS msg;'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Paso 4: Agregar la clave foránea (si no existe)
SET @fk_name = 'fk_usuarios_carrera_id';
SET @sql = (SELECT IF(
    NOT EXISTS(SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'usuarios' AND constraint_name = @fk_name AND constraint_type = 'FOREIGN KEY'),
    CONCAT('ALTER TABLE usuarios ADD CONSTRAINT ', @fk_name, ' FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE SET NULL ON UPDATE CASCADE'),
    'SELECT "La clave foránea ya existe." AS msg;'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Paso 5: Eliminar la columna temporal `carrera_nombre` (si existe)
SET @sql = (SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND column_name = 'carrera_nombre'),
    'ALTER TABLE usuarios DROP COLUMN carrera_nombre',
    'SELECT "La columna `carrera_nombre` no existe, no se elimina." AS msg;'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
