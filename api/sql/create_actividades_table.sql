-- Crear tabla de actividades
CREATE TABLE IF NOT EXISTS `actividades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` enum('estudiante','sistema','academico','usuario') NOT NULL,
  `mensaje` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `detalles` text,
  PRIMARY KEY (`id`),
  KEY `idx_actividades_fecha` (`fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales para pruebas
INSERT INTO `actividades` (`tipo`, `mensaje`, `fecha`, `detalles`) 
VALUES 
('estudiante', 'Se registraron 5 nuevos alumnos', DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL),
('sistema', 'Sistema actualizado a versión 2.5.0', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Actualización de seguridad y mejoras de rendimiento'),
('academico', 'Inicio del período académico 2025', DATE_SUB(NOW(), INTERVAL 2 DAY), NULL),
('usuario', 'El administrador modificó la configuración del sistema', DATE_SUB(NOW(), INTERVAL 3 DAY), 'Cambios en la política de contraseñas');
