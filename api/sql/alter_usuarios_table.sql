-- Agregar campos faltantes a la tabla usuarios
-- Estos campos son necesarios para almacenar información específica por rol

ALTER TABLE usuarios 
ADD COLUMN dni VARCHAR(20) NULL AFTER password_hash,
ADD COLUMN carrera VARCHAR(100) NULL AFTER dni,
ADD COLUMN especialidad VARCHAR(100) NULL AFTER carrera,
ADD COLUMN telefono VARCHAR(20) NULL AFTER especialidad,
ADD COLUMN departamento ENUM('Dirección', 'Secretaría', 'Administración', 'Sistemas') NULL AFTER telefono;

-- Agregar índices para optimizar consultas
ALTER TABLE usuarios 
ADD INDEX idx_email (email),
ADD INDEX idx_role (role),
ADD INDEX idx_created_at (created_at);

-- Verificar si los campos ya existen antes de agregarlos
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'dni' AND TABLE_SCHEMA = DATABASE()) = 0,
    'ALTER TABLE usuarios ADD COLUMN dni VARCHAR(20) NULL AFTER password_hash',
    'SELECT "Campo dni ya existe" as mensaje'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Insertar usuario administrador por defecto si no existe
INSERT IGNORE INTO usuarios (id, email, name, role, password_hash) VALUES 
('admin-001', 'admin@beltran.edu.ar', 'Administrador Sistema', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insertar algunos usuarios de ejemplo
INSERT IGNORE INTO usuarios (id, email, name, role, password_hash, especialidad) VALUES 
('prof-001', 'profesor@beltran.edu.ar', 'Juan Carlos Pérez', 'profesor', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Programación');

INSERT IGNORE INTO usuarios (id, email, name, role, password_hash, dni, carrera) VALUES 
('est-001', 'estudiante@beltran.edu.ar', 'María González', 'student', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345678', 'Técnico en Programación');
