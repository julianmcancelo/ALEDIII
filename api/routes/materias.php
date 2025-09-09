<?php
require_once __DIR__ . '/../controllers/MateriasController.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new MateriasController();
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

// Obtener parámetros de la URL
$id = null;
$carrera_id = null;
$anio = null;

if (count($segments) >= 3 && $segments[2] !== '') {
    $id = $segments[2];
}

// Verificar query parameters para filtros
if (isset($_GET['carrera_id'])) {
    $carrera_id = $_GET['carrera_id'];
}
if (isset($_GET['anio'])) {
    $anio = $_GET['anio'];
}

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                $controller->getMateriaById($id);
            } elseif ($carrera_id && $anio) {
                $controller->getMateriasByAnio($carrera_id, $anio);
            } elseif ($carrera_id) {
                $controller->getMateriasByCarrera($carrera_id);
            } else {
                $controller->getMaterias();
            }
            break;
            
        case 'POST':
            $controller->createMateria();
            break;
            
        case 'PUT':
            if ($id) {
                $controller->updateMateria($id);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID de materia requerido para actualizar']);
            }
            break;
            
        case 'DELETE':
            if ($id) {
                $controller->deleteMateria($id);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID de materia requerido para eliminar']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    error_log("Error en routes/materias.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
?>
