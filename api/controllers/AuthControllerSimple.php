<?php
// AuthController simplificado que funciona con la tabla actual
require_once 'config/database.php';

class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['email']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email y contraseña son requeridos']);
            return;
        }

        try {
            $stmt = $this->db->prepare("SELECT id, email, name, role, password_hash FROM usuarios WHERE email = ?");
            $stmt->execute([$input['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($input['password'], $user['password_hash'])) {
                unset($user['password_hash']);
                header('Content-Type: application/json');
                echo json_encode($user);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciales inválidas']);
            }
        } catch (PDOException $e) {
            error_log("Error en login: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }

    public function createUser() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['email']) || !isset($input['name']) || !isset($input['role']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email, nombre, rol y contraseña son requeridos']);
            return;
        }

        $validRoles = ['admin', 'student', 'profesor'];
        if (!in_array($input['role'], $validRoles)) {
            http_response_code(400);
            echo json_encode(['error' => 'Rol inválido. Debe ser: admin, student o profesor']);
            return;
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email inválido']);
            return;
        }

        try {
            $id = $this->generateUUID();
            $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
            
            $stmt = $this->db->prepare("INSERT INTO usuarios (id, email, name, role, password_hash) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$id, $input['email'], $input['name'], $input['role'], $hashedPassword]);

            header('Content-Type: application/json');
            echo json_encode([
                'id' => $id,
                'email' => $input['email'],
                'name' => $input['name'],
                'role' => $input['role'],
                'created_at' => date('Y-m-d H:i:s')
            ]);
        } catch (PDOException $e) {
            error_log("Error en createUser: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Error al crear usuario: ' . $e->getMessage()]);
        }
    }

    public function getAllUsers() {
        try {
            $stmt = $this->db->prepare("SELECT id, email, name, role, created_at FROM usuarios ORDER BY created_at DESC");
            $stmt->execute();
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if ($usuarios === false) {
                $usuarios = [];
            }
            
            header('Content-Type: application/json');
            echo json_encode($usuarios);
        } catch (PDOException $e) {
            error_log("Error en getAllUsers: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Error al obtener usuarios: ' . $e->getMessage()]);
        } catch (Exception $e) {
            error_log("Error general en getAllUsers: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }

    public function getUserByCredentials() {
        if (!isset($_GET['email']) || !isset($_GET['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email y password son requeridos']);
            return;
        }

        try {
            $stmt = $this->db->prepare("SELECT id, email, name, role, password_hash FROM usuarios WHERE email = ?");
            $stmt->execute([$_GET['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($_GET['password'], $user['password_hash'])) {
                unset($user['password_hash']);
                header('Content-Type: application/json');
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al buscar usuario']);
        }
    }

    public function deleteUser($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM usuarios WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Usuario eliminado correctamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar usuario']);
        }
    }

    private function generateUUID() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
?>
