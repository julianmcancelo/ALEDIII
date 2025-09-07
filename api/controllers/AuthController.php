<?php
class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->connect();
    }

    public function login() {
        // Leer datos JSON del cuerpo de la petición
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Verificar que existan email y password
        if (!isset($input['email']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email y contraseña requeridos']);
            return;
        }

        $email = $input['email'];
        $password = $input['password'];

        try {
            // Buscar usuario por email
            $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Depurar información (solo desarrollo)
            error_log("Usuario encontrado: " . ($user ? 'Sí' : 'No'));
            if ($user) {
                error_log("Password hash en BD: " . $user['password_hash']);
            }
            
            // Verificar contraseña con password_verify (para hash bcrypt)
            if ($user && password_verify($password, $user['password_hash'])) {
                // Autenticación exitosa - remover password_hash de la respuesta
                unset($user['password_hash']);
                
                header('Content-Type: application/json');
                echo json_encode($user);
            } else {
                // Autenticación fallida
                http_response_code(401);
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Credenciales inválidas']);
            }
        } catch (PDOException $e) {
            // Error de base de datos
            error_log("Error en login: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Error de base de datos: ' . $e->getMessage()]);
        }
    }

    public function getUserByCredentials() {
        $email = $_GET['email'] ?? '';
        $password = $_GET['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email y contraseña requeridos']);
            return;
        }

        try {
            $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                // Remover password_hash de la respuesta
                unset($user['password_hash']);
                echo json_encode([$user]); // Retornar array para compatibilidad con MockAPI
            } else {
                echo json_encode([]); // Array vacío si no encuentra usuario
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error de base de datos']);
        }
    }

    public function createUser() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validar datos requeridos
        if (!isset($input['email']) || !isset($input['name']) || !isset($input['role']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email, nombre, rol y contraseña son requeridos']);
            return;
        }

        // Validar rol
        $validRoles = ['admin', 'student', 'profesor'];
        if (!in_array($input['role'], $validRoles)) {
            http_response_code(400);
            echo json_encode(['error' => 'Rol inválido. Debe ser: admin, student o profesor']);
            return;
        }

        // Validar email
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email inválido']);
            return;
        }

        try {
            $id = $this->generateUUID();
            $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
            
            // Preparar campos adicionales según el rol
            $dni = isset($input['dni']) ? $input['dni'] : null;
            $carrera = isset($input['carrera']) ? $input['carrera'] : null;
            $especialidad = isset($input['especialidad']) ? $input['especialidad'] : null;
            $telefono = isset($input['telefono']) ? $input['telefono'] : null;
            $departamento = isset($input['departamento']) ? $input['departamento'] : null;
            
            $stmt = $this->db->prepare("
                INSERT INTO usuarios (id, email, name, role, password_hash, dni, carrera, especialidad, telefono, departamento) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $id,
                $input['email'],
                $input['name'],
                $input['role'],
                $hashedPassword,
                $dni,
                $carrera,
                $especialidad,
                $telefono,
                $departamento
            ]);

            // Devolver el usuario creado sin la contraseña
            header('Content-Type: application/json');
            echo json_encode([
                'id' => $id,
                'email' => $input['email'],
                'name' => $input['name'],
                'role' => $input['role'],
                'dni' => $dni,
                'carrera' => $carrera,
                'especialidad' => $especialidad,
                'telefono' => $telefono,
                'departamento' => $departamento,
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
            $stmt = $this->db->prepare("SELECT id, email, name, role, dni, carrera, especialidad, telefono, departamento, created_at FROM usuarios ORDER BY created_at DESC");
            $stmt->execute();
            $users = $stmt->fetchAll();
            
            echo json_encode($users);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener usuarios']);
        }
    }

    public function deleteUser($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);

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

    public function getAllUsers() {
        try {
            $stmt = $this->db->prepare("SELECT id, email, name, role, dni, carrera, especialidad, telefono, departamento, created_at FROM usuarios ORDER BY created_at DESC");
            $stmt->execute();
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Asegurar que siempre devolvemos un array válido
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
