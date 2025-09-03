-- Crear tabla usuarios para el sistema ALEDIII
-- Esta tabla almacena información de usuarios (admin, profesores, estudiantes)

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'profesor', 'student') NOT NULL DEFAULT 'student',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Campos específicos por rol
    dni VARCHAR(20) NULL,
    carrera VARCHAR(100) NULL,
    especialidad VARCHAR(100) NULL,
    telefono VARCHAR(20) NULL,
    departamento ENUM('Dirección', 'Secretaría', 'Administración', 'Sistemas') NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- Insertar usuario administrador por defecto
INSERT IGNORE INTO usuarios (id, email, name, role, password) VALUES 
('admin-001', 'admin@beltran.edu.ar', 'Administrador Sistema', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insertar algunos usuarios de ejemplo
INSERT IGNORE INTO usuarios (id, email, name, role, password, especialidad) VALUES 
('prof-001', 'profesor@beltran.edu.ar', 'Juan Carlos Pérez', 'profesor', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Programación');

INSERT IGNORE INTO usuarios (id, email, name, role, password, dni, carrera) VALUES 
('est-001', 'estudiante@beltran.edu.ar', 'María González', 'student', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345678', 'Técnico en Programación');
