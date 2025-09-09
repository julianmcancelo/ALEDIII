<?php
require_once __DIR__ . '/../controllers/CarrerasController.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new CarrerasController();
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

// Obtener el ID si está presente en la URL
$id = null;
if (count($segments) >= 3 && $segments[2] !== '') {
    $id = $segments[2];
}

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                $controller->getCarreraById($id);
            } else {
                $controller->getCarreras();
            }
            break;
            
        case 'POST':
            $controller->createCarrera();
            break;
            
        case 'PUT':
            if ($id) {
                $controller->updateCarrera($id);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID de carrera requerido para actualizar']);
            }
            break;
            
        case 'DELETE':
            if ($id) {
                $controller->deleteCarrera($id);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID de carrera requerido para eliminar']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    error_log("Error en routes/carreras.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
?>
