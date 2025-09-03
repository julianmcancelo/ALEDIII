# Configuración Backend - Proyecto ALEDIII

## 📊 Credenciales MySQL

```
Servidor: localhost
Usuario: jcancelo_aled3
Contraseña: feeltehsky1
Base de datos: jcancelo_aled3
```

## 🚀 Script SQL de Inicialización

```sql
-- Usar la base de datos
USE jcancelo_aled3;

-- Tabla de usuarios para autenticación
CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student', 'profesor') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de estudiantes
CREATE TABLE estudiantes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    legajo VARCHAR(50) UNIQUE NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    dni VARCHAR(20) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    carrera VARCHAR(255) NOT NULL,
    fecha_inscripcion DATE NOT NULL,
    estado ENUM('activo', 'inactivo', 'graduado') DEFAULT 'activo',
    
    -- Dirección
    direccion_calle VARCHAR(255),
    direccion_ciudad VARCHAR(100),
    direccion_provincia VARCHAR(100),
    direccion_codigo_postal VARCHAR(10),
    
    -- Contacto de emergencia
    contacto_emergencia_nombre VARCHAR(255),
    contacto_emergencia_telefono VARCHAR(20),
    contacto_emergencia_parentesco VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de suscripciones al newsletter
CREATE TABLE newsletter_subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Insertar usuarios de prueba
INSERT INTO usuarios (email, name, role, password_hash) VALUES
('admin@ibeltran.com.ar', 'Administrador', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('sebastian.saldivar@ibeltran.com.ar', 'Sebastian Saldivar', 'profesor', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('jose.casalnovo@ibeltran.com.ar', 'Jose Casalnovo', 'profesor', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('gabriela.tajes@ibeltran.com.ar', 'Gabriela Tajes', 'profesor', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('sebastian.ceballos@ibeltran.com.ar', 'Sebastian Ceballos', 'profesor', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
```

## 🔧 Configuración PHP Nativo

### config/database.php
```php
<?php
class Database {
    private $host = 'localhost';
    private $dbname = 'jcancelo_aled3';
    private $username = 'jcancelo_aled3';
    private $password = 'feeltehsky1';
    private $pdo;

    public function connect() {
        if ($this->pdo === null) {
            try {
                $this->pdo = new PDO(
                    "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4", 
                    $this->username, 
                    $this->password
                );
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch(PDOException $e) {
                die("Error de conexión: " . $e->getMessage());
            }
        }
        return $this->pdo;
    }
}
?>
```

## 📋 Endpoints Requeridos

### Autenticación
- `POST /api/users/login` - Iniciar sesión
- `GET /api/users?email={email}&password={password}` - Verificar credenciales

### Estudiantes
- `GET /api/students` - Listar estudiantes
- `GET /api/students/{id}` - Obtener estudiante por ID
- `POST /api/students` - Crear estudiante
- `PUT /api/students/{id}` - Actualizar estudiante
- `DELETE /api/students/{id}` - Eliminar estudiante
- `GET /api/students?carrera={carrera}` - Filtrar por carrera
- `GET /api/students?estado={estado}` - Filtrar por estado

### Newsletter
- `POST /api/newsletter` - Suscribir email

## 🔐 Contraseñas de Prueba

Todas las contraseñas de los usuarios de prueba son: `password`
- Hash bcrypt: `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`

## 🌐 CORS Configuration

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```
