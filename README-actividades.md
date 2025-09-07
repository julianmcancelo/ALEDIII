# Módulo de Actividades Recientes

Este módulo implementa la funcionalidad para registrar y mostrar actividades recientes en el sistema.

## Estructura de archivos

- **Frontend**
  - `src/app/nucleo/modelos/actividad.model.ts`: Interfaz del modelo de actividad
  - `src/app/nucleo/servicios/actividad.service.ts`: Servicio para gestionar actividades
  - `src/app/diseno/panel/panel-inicio/dashboard-home.component.*`: Componente que muestra las actividades

- **Backend**
  - `api/actividades.php`: Punto de entrada para el API de actividades
  - `api/controllers/ActividadController.php`: Controlador que maneja las solicitudes
  - `api/models/Actividad.php`: Modelo para acceder a los datos
  - `api/sql/create_actividades_table.sql`: Script SQL para crear la tabla

## Instalación

### 1. Crear la tabla en la base de datos

Ejecuta el script SQL `api/sql/create_actividades_table.sql` en tu base de datos MySQL:

```bash
mysql -u tu_usuario -p tu_base_de_datos < api/sql/create_actividades_table.sql
```

O copia y pega el contenido del script en tu cliente MySQL (phpMyAdmin, MySQL Workbench, etc.).

### 2. Verificar la configuración

Asegúrate que la configuración de la base de datos en `api/config/database.php` sea correcta.

## Uso del API

### Obtener actividades recientes

**Endpoint:** `GET /api/actividades.php`

**Parámetros:**
- `limit` (opcional): Número máximo de actividades a devolver (predeterminado: 5)

**Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "tipo": "estudiante",
    "mensaje": "Se registraron 5 nuevos alumnos",
    "fecha": "2025-09-07 11:30:45",
    "detalles": null
  },
  {
    "id": 2,
    "tipo": "sistema",
    "mensaje": "Sistema actualizado a versión 2.5.0",
    "fecha": "2025-09-06 13:15:22",
    "detalles": "Actualización de seguridad y mejoras de rendimiento"
  }
]
```

### Registrar nueva actividad

**Endpoint:** `POST /api/actividades.php`

**Cuerpo de la solicitud:**
```json
{
  "tipo": "usuario",
  "mensaje": "Usuario modificó configuración",
  "detalles": "Cambios en preferencias de notificación"
}
```

## Tipos de actividad

El sistema soporta los siguientes tipos de actividad:

- `estudiante`: Actividades relacionadas con los estudiantes
- `sistema`: Eventos del sistema y actualizaciones
- `academico`: Eventos académicos como períodos, evaluaciones, etc.
- `usuario`: Acciones realizadas por los usuarios del sistema

## Integración con otros módulos

Para registrar una nueva actividad desde cualquier controlador:

```php
require_once '../models/Actividad.php';
// ...

$db = $database->connect();
$actividad = new Actividad($db);
$actividad->tipo = 'estudiante';
$actividad->mensaje = 'Nuevo estudiante registrado: Juan Pérez';
$actividad->crear();
```
