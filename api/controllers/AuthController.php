<?php
// AuthController mínimo que funciona con la tabla actual
require_once 'config/database.php';

class AuthController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->pdo;
    }

    public function checkUsersExist() {
        try {
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM usuarios");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            header('Content-Type: application/json');
            echo json_encode(['hasUsers' => $result['count'] > 0, 'count' => $result['count']]);
        } catch (PDOException $e) {
            error_log("Error en checkUsersExist: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Error al verificar usuarios']);
        }
    }

    public function getAllUsers() {
        try {
            $role = $_GET['role'] ?? null;

            $query = "
                SELECT 
                    u.*, 
                    c.nombre as carrera_nombre
                FROM 
                    usuarios u
                LEFT JOIN 
                    carreras c ON u.carrera_id = c.id
            ";
            
            $params = [];
            if ($role) {
                $query .= " WHERE u.role = ?";
                $params[] = $role;
            }

            $query .= " ORDER BY u.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
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
            
            // Preparar datos para inserción con valores por defecto
            $userData = [
                'id' => $id,
                'email' => $input['email'],
                'name' => $input['name'],
                'apellidos' => $input['apellidos'] ?? null,
                'role' => $input['role'],
                'password_hash' => $hashedPassword,
                'dni' => $input['dni'] ?? null,
                'legajo' => $input['legajo'] ?? null,
                'carrera_id' => $input['carrera_id'] ?? null,
                'telefono' => $input['telefono'] ?? null,
                'departamento' => $input['departamento'] ?? null,
                'especialidad' => $input['especialidad'] ?? null,
                'fechaNacimiento' => $input['fechaNacimiento'] ?? null,
                'fechaInscripcion' => $input['fechaInscripcion'] ?? null,
                'estado' => $input['estado'] ?? 'activo',
                'calle' => $input['calle'] ?? null,
                'ciudad' => $input['ciudad'] ?? null,
                'provincia' => $input['provincia'] ?? null,
                'codigoPostal' => $input['codigoPostal'] ?? null,
                'contacto_emergencia_nombre' => $input['contacto_emergencia_nombre'] ?? null,
                'contacto_emergencia_telefono' => $input['contacto_emergencia_telefono'] ?? null,
                'contacto_emergencia_parentesco' => $input['contacto_emergencia_parentesco'] ?? null
            ];

            // Log para debug
            error_log("Datos a insertar: " . json_encode($userData));

            try {
                $stmt = $this->db->prepare("INSERT INTO usuarios (
                    id, email, name, apellidos, role, password_hash, 
                    dni, legajo, carrera_id, telefono, departamento, especialidad,
                    fechaNacimiento, fechaInscripcion, estado, 
                    calle, ciudad, provincia, codigoPostal,
                    contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_parentesco
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                $params = array_values($userData);
                error_log("Número de parámetros: " . count($params));
                
                $stmt->execute($params);

                header('Content-Type: application/json');
                echo json_encode([
                    'id' => $id,
                    'email' => $input['email'],
                    'name' => $input['name'],
                    'apellidos' => $input['apellidos'] ?? null,
                    'role' => $input['role'],
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            } catch (PDOException $e) {
                error_log("Error en createUser: " . $e->getMessage());
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Error al crear usuario: ' . $e->getMessage()]);
            }
        } catch (PDOException $e) {
            error_log("Error en createUser: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Error al crear usuario: ' . $e->getMessage()]);
        }
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
                echo json_encode([$user]); // Devolver array para compatibilidad con AuthService
            } else {
                header('Content-Type: application/json');
                echo json_encode([]); // Array vacío si no encuentra usuario
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al buscar usuario']);
        }
    }

    public function updateUser($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        // Construir la consulta dinámicamente
        $fields = [];
        $params = [];
        
        // Lista de campos permitidos para actualizar
        $allowedFields = [
            'name', 'apellidos', 'email', 'dni', 'legajo', 'carrera_id', 
            'telefono', 'departamento', 'fechaNacimiento', 'fechaInscripcion', 'estado', 
            'calle', 'ciudad', 'provincia', 'codigoPostal', 'contacto_emergencia_nombre', 
            'contacto_emergencia_telefono', 'contacto_emergencia_parentesco'
        ];

        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $fields[] = "`$field` = ?";
                $params[] = $input[$field];
            }
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No hay campos para actualizar']);
            return;
        }

        $params[] = $id; // Agregar el ID al final para el WHERE

        try {
            $stmt = $this->db->prepare("UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($params);

            if ($stmt->rowCount() > 0) {
                // Devolver el usuario actualizado
                $this->getUserById($id);
            } else {
                // Si no se afectaron filas, puede ser que no se encontró el usuario o los datos eran los mismos
                $this->getUserById($id); 
            }
        } catch (PDOException $e) {
            error_log("Error en updateUser: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar usuario: ' . $e->getMessage()]);
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

    public function getUserById($id) {
        try {
            $query = "
                SELECT 
                    u.*, 
                    c.nombre as carrera_nombre
                FROM 
                    usuarios u
                LEFT JOIN 
                    carreras c ON u.carrera_id = c.id
                WHERE u.id = ?
            ";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                header('Content-Type: application/json');
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
            }
        } catch (PDOException $e) {
            error_log("Error en getUserById: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener usuario']);
        }
    }

    public function getUsers() {
        try {
            $role = isset($_GET['role']) ? $_GET['role'] : null;
            
            if ($role) {
                $sql = "SELECT id, email, name, role, dni, carrera, especialidad, telefono, departamento, created_at 
                        FROM usuarios 
                        WHERE role = :role 
                        ORDER BY created_at DESC";
                $stmt = $this->db->prepare($sql);
                $stmt->bindParam(':role', $role);
            } else {
                $sql = "SELECT id, email, name, role, dni, carrera, especialidad, telefono, departamento, created_at 
                        FROM usuarios 
                        ORDER BY created_at DESC";
                $stmt = $this->db->prepare($sql);
            }
            
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Error al obtener usuarios: ' . $e->getMessage()];
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
