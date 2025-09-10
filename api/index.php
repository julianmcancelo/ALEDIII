<?php
// API Principal - Proyecto ALEDIII
// Manejo de rutas y CORS para PHP nativo

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir archivos necesarios
require_once 'config/database.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/NewsletterController.php';
require_once 'controllers/CarrerasController.php';
require_once 'controllers/MateriasController.php';
require_once 'controllers/ProfesoresController.php';

// Obtener la ruta solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api', '', $path); // Remover /api del path
$method = $_SERVER['REQUEST_METHOD'];

// Router simple
try {
    switch (true) {
        // Rutas de autenticación
        case preg_match('/^\/users\/login$/', $path) && $method === 'POST':
            $controller = new AuthController();
            $controller->login();
            break;
            
        case preg_match('/^\/users$/', $path) && $method === 'GET':
            $controller = new AuthController();
            if (isset($_GET['email']) && isset($_GET['password'])) {
                $controller->getUserByCredentials();
            } elseif (isset($_GET['check'])) {
                $controller->checkUsersExist();
            } else {
                $controller->getAllUsers();
            }
            break;
            
        case preg_match('/^\/users$/', $path) && $method === 'POST':
            $controller = new AuthController();
            $controller->createUser();
            break;
            
        case preg_match('/^\/users\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'GET':
            $controller = new AuthController();
            $controller->getUserById($matches[1]);
            break;

        case preg_match('/^\/users\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'PUT':
            $controller = new AuthController();
            $controller->updateUser($matches[1]);
            break;

        case preg_match('/^\/users\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'DELETE':
            $controller = new AuthController();
            $controller->deleteUser($matches[1]);
            break;


        // Rutas de carreras
        case preg_match('/^\/carreras$/', $path) && $method === 'GET':
            $controller = new CarrerasController();
            $controller->getCarreras();
            break;

        case preg_match('/^\/carreras\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'GET':
            $controller = new CarrerasController();
            $controller->getCarreraById($matches[1]);
            break;

        case preg_match('/^\/carreras$/', $path) && $method === 'POST':
            $controller = new CarrerasController();
            $controller->createCarrera();
            break;

        case preg_match('/^\/carreras\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'PUT':
            $controller = new CarrerasController();
            $controller->updateCarrera($matches[1]);
            break;

        case preg_match('/^\/carreras\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'DELETE':
            $controller = new CarrerasController();
            $controller->deleteCarrera($matches[1]);
            break;

        // Rutas de materias
        case preg_match('/^\/materias$/', $path) && $method === 'GET':
            $controller = new MateriasController();
            if (isset($_GET['carrera_id']) && isset($_GET['anio'])) {
                $controller->getMateriasByAnio($_GET['carrera_id'], $_GET['anio']);
            } elseif (isset($_GET['carrera_id'])) {
                $controller->getMateriasByCarrera($_GET['carrera_id']);
            } else {
                $controller->getMaterias();
            }
            break;

        case preg_match('/^\/materias\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'GET':
            $controller = new MateriasController();
            $controller->getMateriaById($matches[1]);
            break;

        case preg_match('/^\/materias$/', $path) && $method === 'POST':
            $controller = new MateriasController();
            $controller->createMateria();
            break;

        case preg_match('/^\/materias\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'PUT':
            $controller = new MateriasController();
            $controller->updateMateria($matches[1]);
            break;

        case preg_match('/^\/materias\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'DELETE':
            $controller = new MateriasController();
            $controller->deleteMateria($matches[1]);
            break;

        // Rutas de profesores
        case preg_match('/^\/profesores$/', $path) && $method === 'GET':
            $controller = new ProfesoresController();
            $controller->getProfesores();
            break;

        case preg_match('/^\/profesores\/(\d+)$/', $path, $matches) && $method === 'GET':
            $controller = new ProfesoresController();
            if (isset($matches[1])) {
                $controller->getProfesorById($matches[1]);
            }
            break;

        case preg_match('/^\/profesores\/(\d+)\/materias$/', $path, $matches) && $method === 'GET':
            $controller = new ProfesoresController();
            if (isset($matches[1])) {
                $controller->getMateriasByProfesor($matches[1]);
            }
            break;

        case preg_match('/^\/carreras\/(\d+)\/profesores$/', $path, $matches) && $method === 'GET':
            $controller = new ProfesoresController();
            if (isset($matches[1])) {
                $controller->getProfesoresByCarrera($matches[1]);
            }
            break;

        // Rutas de newsletter
        case preg_match('/^\/newsletter$/', $path) && $method === 'POST':
            $controller = new NewsletterController();
            $controller->subscribe();
            break;

        default:
            http_response_code(404);
            echo json_encode([
                'error' => 'Endpoint no encontrado',
                'path' => $path,
                'method' => $method,
                'debug' => 'Ruta solicitada: ' . $_SERVER['REQUEST_URI']
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
}
?>
