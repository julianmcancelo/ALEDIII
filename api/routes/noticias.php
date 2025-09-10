<?php
/**
 * Rutas para el manejo de noticias
 * Define los endpoints REST para CRUD de noticias
 */

require_once __DIR__ . '/../controllers/NoticiasController.php';

// Crear instancia del controlador
$noticiasController = new NoticiasController();

// Obtener el método HTTP y la ruta
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extraer el ID de la URL si existe
$pathParts = explode('/', trim($path, '/'));
$noticiaId = null;

// Buscar el ID en la URL (formato: /api/noticias/{id})
if (count($pathParts) >= 3 && $pathParts[1] === 'noticias' && is_numeric($pathParts[2])) {
    $noticiaId = (int)$pathParts[2];
}

// Manejar las rutas según el método HTTP
switch ($method) {
    case 'GET':
        if ($noticiaId) {
            // GET /api/noticias/{id} - Obtener una noticia específica
            $result = $noticiasController->obtenerNoticia($noticiaId);
        } else if (isset($_GET['admin']) && $_GET['admin'] === 'true') {
            // GET /api/noticias?admin=true - Obtener todas las noticias para admin
            $result = $noticiasController->obtenerNoticiasAdmin();
        } else {
            // GET /api/noticias - Obtener noticias públicas con paginación
            $result = $noticiasController->obtenerNoticias();
        }
        break;
        
    case 'POST':
        if ($noticiaId && isset($_GET['action'])) {
            // POST /api/noticias/{id}?action=cambiar-estado - Cambiar estado
            if ($_GET['action'] === 'cambiar-estado') {
                $result = $noticiasController->cambiarEstado($noticiaId);
            } else {
                $result = [
                    'success' => false,
                    'message' => 'Acción no válida'
                ];
            }
        } else {
            // POST /api/noticias - Crear nueva noticia
            $result = $noticiasController->crearNoticia();
        }
        break;
        
    case 'PUT':
        if ($noticiaId) {
            // PUT /api/noticias/{id} - Actualizar noticia
            $result = $noticiasController->actualizarNoticia($noticiaId);
        } else {
            $result = [
                'success' => false,
                'message' => 'ID de noticia requerido para actualización'
            ];
        }
        break;
        
    case 'DELETE':
        if ($noticiaId) {
            // DELETE /api/noticias/{id} - Eliminar noticia
            $result = $noticiasController->eliminarNoticia($noticiaId);
        } else {
            $result = [
                'success' => false,
                'message' => 'ID de noticia requerido para eliminación'
            ];
        }
        break;
        
    default:
        $result = [
            'success' => false,
            'message' => 'Método HTTP no soportado'
        ];
        break;
}

// Establecer headers de respuesta
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Establecer código de respuesta HTTP
if ($result['success']) {
    http_response_code(200);
} else {
    http_response_code(400);
}

// Enviar respuesta JSON
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
