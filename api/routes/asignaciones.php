<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Verificar ruta del controlador
$controller_path = __DIR__ . '/../controllers/AsignacionesController.php';
error_log("Asignaciones Route - Controller path: " . $controller_path);
error_log("Asignaciones Route - Controller exists: " . (file_exists($controller_path) ? 'YES' : 'NO'));

require_once __DIR__ . '/../controllers/AsignacionesController.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new AsignacionesController();
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

try {
    // Log para debugging
    error_log("AsignacionesController - Method: " . $method);
    error_log("AsignacionesController - GET params: " . json_encode($_GET));
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['materia_id'])) {
                if (isset($_GET['tipo']) && $_GET['tipo'] === 'profesores') {
                    $result = $controller->getProfesoresByMateria($_GET['materia_id']);
                    error_log("AsignacionesController - Profesores result: " . json_encode($result));
                    echo json_encode($result);
                } elseif (isset($_GET['tipo']) && $_GET['tipo'] === 'estudiantes') {
                    $result = $controller->getEstudiantesByMateria($_GET['materia_id']);
                    error_log("AsignacionesController - Estudiantes result: " . json_encode($result));
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Tipo de consulta requerido (profesores/estudiantes)']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Materia ID requerido']);
            }
            break;

        case 'POST':
            if (strpos($path, '/asignar-profesor') !== false) {
                echo json_encode($controller->asignarProfesor());
            } elseif (strpos($path, '/asignar-estudiante') !== false) {
                echo json_encode($controller->asignarEstudiante());
            } elseif (strpos($path, '/asignacion-masiva-profesores') !== false) {
                echo json_encode($controller->asignacionMasivaProfesores());
            } elseif (strpos($path, '/asignacion-masiva-estudiantes') !== false) {
                echo json_encode($controller->asignacionMasivaEstudiantes());
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint no encontrado']);
            }
            break;

        case 'DELETE':
            if (isset($_GET['materia_id']) && isset($_GET['usuario_id'])) {
                if (isset($_GET['tipo']) && $_GET['tipo'] === 'profesor') {
                    echo json_encode($controller->removerProfesor($_GET['materia_id'], $_GET['usuario_id']));
                } elseif (isset($_GET['tipo']) && $_GET['tipo'] === 'estudiante') {
                    echo json_encode($controller->removerEstudiante($_GET['materia_id'], $_GET['usuario_id']));
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Tipo de usuario requerido (profesor/estudiante)']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Materia ID y Usuario ID requeridos']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
}
?>
