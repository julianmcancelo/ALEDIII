-- Crear tabla de noticias para el sistema ALEDIII
-- Esta tabla almacenará todas las noticias del instituto

CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT NOT NULL,
    contenido LONGTEXT NOT NULL,
    imagen_url VARCHAR(500),
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    autor VARCHAR(100) NOT NULL DEFAULT 'Administrador',
    estado ENUM('borrador', 'publicada', 'archivada') NOT NULL DEFAULT 'borrador',
    categoria VARCHAR(50) NOT NULL DEFAULT 'general',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_estado (estado),
    INDEX idx_fecha_publicacion (fecha_publicacion),
    INDEX idx_categoria (categoria)
);

-- Insertar noticias de ejemplo basadas en el contenido actual del home
INSERT INTO noticias (titulo, resumen, contenido, imagen_url, fecha_publicacion, autor, estado, categoria) VALUES
(
    'Aportes gubernamentales para mejoras',
    'Como cada año, las autoridades de los diferentes servicios educativos del ITB trabajan en la confección y presentación del Plan de Mejora...',
    'Como cada año, las autoridades de los diferentes servicios educativos del ITB trabajan en la confección y presentación del Plan de Mejora. Este plan incluye inversiones en infraestructura, equipamiento tecnológico y capacitación docente para brindar una educación de calidad a nuestros estudiantes.\n\nLas mejoras contempladas incluyen:\n- Renovación de laboratorios\n- Actualización de equipos informáticos\n- Ampliación de espacios de estudio\n- Programas de capacitación continua para docentes\n\nEstos aportes gubernamentales representan una inversión significativa en el futuro de nuestros estudiantes y en el fortalecimiento de la educación técnica superior.',
    'assets/images/home/noticia_110.jpg',
    '2025-08-06 10:00:00',
    'Dirección Académica',
    'publicada',
    'institucional'
),
(
    'Comienzo de clases: CICLO 2025',
    'Inició un nuevo ciclo lectivo en el cual recibimos a más de 600 ingresantes de nuestras 9 tecnicaturas...',
    'Inició un nuevo ciclo lectivo en el cual recibimos a más de 600 ingresantes de nuestras 9 tecnicaturas. Este año marca un hito importante en la historia del instituto con el mayor número de inscriptos registrado.\n\nLas tecnicaturas disponibles son:\n- Análisis de Sistemas\n- Diseño Industrial\n- Electrónica\n- Mecánica\n- Construcciones\n- Química\n- Alimentos\n- Textil\n- Seguridad e Higiene\n\nDamos la bienvenida a todos los nuevos estudiantes y les deseamos un ciclo lectivo exitoso lleno de aprendizajes y crecimiento profesional.',
    'assets/images/home/noticia_109.jpg',
    '2025-03-24 09:00:00',
    'Secretaría Académica',
    'publicada',
    'academico'
),
(
    '9º Encuentro de Diseño Industrial',
    'Entre el 7 y 10 de octubre se realizó el 9º EDIB en el Beltrán. Durante la última semana de septiembre se realizó el evento...',
    'Entre el 7 y 10 de octubre se realizó el 9º EDIB (Encuentro de Diseño Industrial Beltrán) en nuestras instalaciones. Durante la última semana de septiembre se realizó el evento que convocó a estudiantes, docentes y profesionales del diseño.\n\nEl encuentro incluyó:\n- Conferencias magistrales de diseñadores reconocidos\n- Talleres prácticos de diseño\n- Exposición de trabajos estudiantiles\n- Mesa redonda sobre tendencias en diseño industrial\n- Networking entre profesionales y estudiantes\n\nEste evento se ha consolidado como uno de los más importantes del sector en la región, fortaleciendo los vínculos entre la academia y la industria del diseño.',
    'assets/images/home/noticia_104.jpg',
    '2024-10-11 14:00:00',
    'Departamento de Diseño Industrial',
    'publicada',
    'eventos'
);
