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
require_once 'controllers/StudentController.php';
require_once 'controllers/NewsletterController.php';

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
            } else {
                $controller->getAllUsers();
            }
            break;
            
        case preg_match('/^\/users$/', $path) && $method === 'POST':
            $controller = new AuthController();
            $controller->createUser();
            break;
            
        case preg_match('/^\/users\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'DELETE':
            $controller = new AuthController();
            $controller->deleteUser($matches[1]);
            break;

        // Rutas de estudiantes
        case preg_match('/^\/students$/', $path) && $method === 'GET':
            $controller = new StudentController();
            $controller->getAll();
            break;
            
        case preg_match('/^\/students\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'GET':
            $controller = new StudentController();
            $controller->getById($matches[1]);
            break;
            
        case preg_match('/^\/students$/', $path) && $method === 'POST':
            $controller = new StudentController();
            $controller->create();
            break;
            
        case preg_match('/^\/students\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'PUT':
            $controller = new StudentController();
            $controller->update($matches[1]);
            break;
            
        case preg_match('/^\/students\/([a-zA-Z0-9\-]+)$/', $path, $matches) && $method === 'DELETE':
            $controller = new StudentController();
            $controller->delete($matches[1]);
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
