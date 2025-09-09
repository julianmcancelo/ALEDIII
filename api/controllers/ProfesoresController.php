<?php
require_once __DIR__ . '/../config/database.php';

class ProfesoresController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->pdo;
    }

    public function getProfesores() {
        try {
            $stmt = $this->db->prepare("
                SELECT id, name, email, especialidad, departamento, created_at
                FROM usuarios 
                WHERE role = 'profesor' 
                ORDER BY name
            ");
            $stmt->execute();
            $profesores = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json');
            echo json_encode($profesores);
        } catch (PDOException $e) {
            error_log("Error en getProfesores: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener profesores']);
        }
    }

    public function getProfesorById($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT id, name, email, especialidad, departamento, created_at
                FROM usuarios 
                WHERE id = ? AND role = 'profesor'
            ");
            $stmt->execute([$id]);
            $profesor = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($profesor) {
                header('Content-Type: application/json');
                echo json_encode($profesor);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Profesor no encontrado']);
            }
        } catch (PDOException $e) {
            error_log("Error en getProfesorById: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener profesor']);
        }
    }

    public function getMateriasByProfesor($profesor_id) {
        try {
            $stmt = $this->db->prepare("
                SELECT m.*, c.nombre as carrera_nombre 
                FROM materias m 
                LEFT JOIN carreras c ON m.carrera_id = c.id 
                WHERE m.profesor_id = ? AND m.estado = 'activa' 
                ORDER BY c.nombre, m.anio, m.nombre
            ");
            $stmt->execute([$profesor_id]);
            $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json');
            echo json_encode($materias);
        } catch (PDOException $e) {
            error_log("Error en getMateriasByProfesor: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener materias del profesor']);
        }
    }
}
?>
