-- Crear tabla de materias
CREATE TABLE IF NOT EXISTS materias (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion TEXT,
    carrera_id VARCHAR(36) NOT NULL,
    anio INT NOT NULL CHECK (anio BETWEEN 1 AND 6),
    cuatrimestre ENUM('1', '2', 'anual') NOT NULL DEFAULT 'anual',
    horas_semanales INT NOT NULL DEFAULT 4,
    estado ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE CASCADE,
    INDEX idx_carrera_anio (carrera_id, anio)
);

-- Insertar materias de ejemplo para Técnico en Informática
INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales) 
SELECT 
    UUID(), 
    'Introducción a la Programación', 
    'PROG-101', 
    'Fundamentos de programación y lógica computacional',
    c.id,
    1,
    '1',
    6
FROM carreras c WHERE c.nombre = 'Técnico en Informática';

INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales) 
SELECT 
    UUID(), 
    'Matemática Aplicada', 
    'MAT-101', 
    'Matemática para informática y sistemas',
    c.id,
    1,
    'anual',
    4
FROM carreras c WHERE c.nombre = 'Técnico en Informática';

INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales) 
SELECT 
    UUID(), 
    'Sistemas Operativos', 
    'SO-201', 
    'Administración y configuración de sistemas operativos',
    c.id,
    2,
    '1',
    5
FROM carreras c WHERE c.nombre = 'Técnico en Informática';

INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales) 
SELECT 
    UUID(), 
    'Base de Datos', 
    'BD-201', 
    'Diseño y administración de bases de datos',
    c.id,
    2,
    '2',
    5
FROM carreras c WHERE c.nombre = 'Técnico en Informática';

INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales) 
SELECT 
    UUID(), 
    'Desarrollo Web', 
    'WEB-301', 
    'Desarrollo de aplicaciones web modernas',
    c.id,
    3,
    'anual',
    6
FROM carreras c WHERE c.nombre = 'Técnico en Informática';

-- Insertar materias de ejemplo para Técnico en Electrónica
INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales) 
SELECT 
    UUID(), 
    'Circuitos Eléctricos', 
    'ELEC-101', 
    'Fundamentos de circuitos eléctricos y análisis',
    c.id,
    1,
    'anual',
    5
FROM carreras c WHERE c.nombre = 'Técnico en Electrónica';

INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales) 
SELECT 
    UUID(), 
    'Electrónica Analógica', 
    'ELEC-201', 
    'Componentes y circuitos electrónicos analógicos',
    c.id,
    2,
    '1',
    6
FROM carreras c WHERE c.nombre = 'Técnico en Electrónica';

INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales) 
SELECT 
    UUID(), 
    'Electrónica Digital', 
    'ELEC-202', 
    'Sistemas digitales y microcontroladores',
    c.id,
    2,
    '2',
    6
FROM carreras c WHERE c.nombre = 'Técnico en Electrónica';
