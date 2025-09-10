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
require_once 'controllers/AsignacionesController.php';
require_once 'controllers/NoticiasController.php';

// Obtener la ruta solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api', '', $path); // Remover /api del path
$method = $_SERVER['REQUEST_METHOD'];

// Debug logging
error_log("API Router - Request URI: " . $request_uri);
error_log("API Router - Processed path: " . $path);
error_log("API Router - Method: " . $method);

// Router simple
try {
    switch (true) {
        // Rutas de asignaciones (mover al principio para evitar conflictos)
        case ($path === '/asignaciones' || preg_match('/^\/asignaciones$/', $path)) && $method === 'GET':
            error_log("AsignacionesRouter - GET request matched, path: " . $path);
            $controller = new AsignacionesController();
            if (isset($_GET['materia_id'])) {
                if (isset($_GET['tipo']) && $_GET['tipo'] === 'profesores') {
                    error_log("AsignacionesRouter - Getting profesores for materia: " . $_GET['materia_id']);
                    echo json_encode($controller->getProfesoresByMateria($_GET['materia_id']));
                } elseif (isset($_GET['tipo']) && $_GET['tipo'] === 'estudiantes') {
                    error_log("AsignacionesRouter - Getting estudiantes for materia: " . $_GET['materia_id']);
                    echo json_encode($controller->getEstudiantesByMateria($_GET['materia_id']));
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Tipo de consulta requerido (profesores/estudiantes)']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Materia ID requerido']);
            }
            break;

        case preg_match('/^\/asignaciones\/profesor$/', $path) && $method === 'POST':
            error_log("AsignacionesRouter - POST profesor request matched, path: " . $path);
            $controller = new AsignacionesController();
            $result = $controller->asignarProfesor();
            error_log("AsignacionesRouter - POST profesor result: " . json_encode($result));
            echo json_encode($result);
            break;

        case preg_match('/^\/asignaciones\/estudiante$/', $path) && $method === 'POST':
            error_log("AsignacionesRouter - POST estudiante request matched, path: " . $path);
            $controller = new AsignacionesController();
            $result = $controller->asignarEstudiante();
            error_log("AsignacionesRouter - POST estudiante result: " . json_encode($result));
            echo json_encode($result);
            break;

        case preg_match('/^\/asignaciones\/profesor\/bulk$/', $path) && $method === 'POST':
            error_log("AsignacionesRouter - POST profesor bulk request matched, path: " . $path);
            $controller = new AsignacionesController();
            echo json_encode($controller->asignacionMasivaProfesores());
            break;

        case preg_match('/^\/asignaciones\/estudiante\/bulk$/', $path) && $method === 'POST':
            error_log("AsignacionesRouter - POST estudiante bulk request matched, path: " . $path);
            $controller = new AsignacionesController();
            echo json_encode($controller->asignacionMasivaEstudiantes());
            break;

        case preg_match('/^\/asignaciones\/profesor$/', $path) && $method === 'DELETE':
            error_log("AsignacionesRouter - DELETE profesor request matched, path: " . $path);
            $controller = new AsignacionesController();
            echo json_encode($controller->removerProfesor());
            break;

        case preg_match('/^\/asignaciones\/estudiante$/', $path) && $method === 'DELETE':
            error_log("AsignacionesRouter - DELETE estudiante request matched, path: " . $path);
            $controller = new AsignacionesController();
            echo json_encode($controller->removerEstudiante());
            break;

        // Rutas de autenticaci車n
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

        // Rutas de noticias
        case preg_match('/^\/noticias$/', $path) && $method === 'GET':
            $controller = new NoticiasController();
            if (isset($_GET['admin']) && $_GET['admin'] === 'true') {
                $controller->getNoticiasAdmin();
            } else {
                $controller->getNoticiasPublicas();
            }
            break;

        case preg_match('/^\/noticias\/(\d+)$/', $path, $matches) && $method === 'GET':
            $controller = new NoticiasController();
            $controller->getNoticiaById($matches[1]);
            break;

        case preg_match('/^\/noticias$/', $path) && $method === 'POST':
            $controller = new NoticiasController();
            $controller->crearNoticia();
            break;

        case preg_match('/^\/noticias\/(\d+)$/', $path, $matches) && $method === 'PUT':
            $controller = new NoticiasController();
            $controller->actualizarNoticia($matches[1]);
            break;

        case preg_match('/^\/noticias\/(\d+)$/', $path, $matches) && $method === 'DELETE':
            $controller = new NoticiasController();
            $controller->eliminarNoticia($matches[1]);
            break;

        case preg_match('/^\/noticias\/(\d+)\/estado$/', $path, $matches) && $method === 'PUT':
            $controller = new NoticiasController();
            $controller->cambiarEstadoNoticia($matches[1]);
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
