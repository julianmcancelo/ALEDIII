-- Crear tablas de relación para asignaciones de materias

-- Tabla de relación materia-profesor (muchos a muchos)
CREATE TABLE IF NOT EXISTS materia_profesores (
    id VARCHAR(36) PRIMARY KEY,
    materia_id VARCHAR(36) NOT NULL,
    profesor_id VARCHAR(36) NOT NULL,
    tipo_asignacion ENUM('titular', 'adjunto', 'auxiliar') NOT NULL DEFAULT 'titular',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_materia_profesor (materia_id, profesor_id),
    INDEX idx_materia (materia_id),
    INDEX idx_profesor (profesor_id),
    INDEX idx_activo (activo)
);

-- Tabla de relación materia-estudiante (muchos a muchos)
CREATE TABLE IF NOT EXISTS materia_estudiantes (
    id VARCHAR(36) PRIMARY KEY,
    materia_id VARCHAR(36) NOT NULL,
    estudiante_id VARCHAR(36) NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('inscrito', 'cursando', 'aprobado', 'desaprobado', 'abandono') NOT NULL DEFAULT 'inscrito',
    nota_final DECIMAL(4,2) NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_materia_estudiante (materia_id, estudiante_id),
    INDEX idx_materia (materia_id),
    INDEX idx_estudiante (estudiante_id),
    INDEX idx_estado (estado),
    INDEX idx_activo (activo)
);

-- Agregar campo profesor_id a materias como profesor principal (opcional)
ALTER TABLE materias ADD COLUMN profesor_principal_id VARCHAR(36) NULL;
ALTER TABLE materias ADD FOREIGN KEY (profesor_principal_id) REFERENCES usuarios(id) ON DELETE SET NULL;
