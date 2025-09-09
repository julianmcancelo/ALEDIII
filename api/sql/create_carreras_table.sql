-- Crear tabla de carreras
CREATE TABLE IF NOT EXISTS carreras (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    duracion_anios INT NOT NULL DEFAULT 3,
    estado ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar carreras del Instituto Beltrán
INSERT INTO carreras (id, nombre, descripcion, duracion_anios) VALUES
(UUID(), 'Técnico en Informática', 'Carrera técnica enfocada en programación, redes y sistemas informáticos', 3),
(UUID(), 'Técnico en Electrónica', 'Carrera técnica en electrónica analógica y digital, microcontroladores', 3),
(UUID(), 'Técnico en Mecánica', 'Carrera técnica en mecánica industrial, máquinas herramientas y mantenimiento', 3),
(UUID(), 'Técnico en Administración', 'Carrera técnica en administración de empresas y gestión comercial', 3);
