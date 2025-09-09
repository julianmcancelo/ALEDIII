<?php
require_once __DIR__ . '/../config/database.php';

class MateriasController {
    private $db;

    public function __construct() {
        $this->db = getConnection();
    }

    public function getMaterias() {
        try {
            $stmt = $this->db->prepare("
                SELECT m.*, c.nombre as carrera_nombre 
                FROM materias m 
                LEFT JOIN carreras c ON m.carrera_id = c.id 
                WHERE m.estado = 'activa' 
                ORDER BY c.nombre, m.anio, m.nombre
            ");
            $stmt->execute();
            $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json');
            echo json_encode($materias);
        } catch (PDOException $e) {
            error_log("Error en getMaterias: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener materias']);
        }
    }

    public function getMateriasByCarrera($carrera_id) {
        try {
            $stmt = $this->db->prepare("
                SELECT m.*, c.nombre as carrera_nombre 
                FROM materias m 
                LEFT JOIN carreras c ON m.carrera_id = c.id 
                WHERE m.carrera_id = ? AND m.estado = 'activa' 
                ORDER BY m.anio, m.cuatrimestre, m.nombre
            ");
            $stmt->execute([$carrera_id]);
            $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json');
            echo json_encode($materias);
        } catch (PDOException $e) {
            error_log("Error en getMateriasByCarrera: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener materias']);
        }
    }

    public function getMateriasByAnio($carrera_id, $anio) {
        try {
            $stmt = $this->db->prepare("
                SELECT m.*, c.nombre as carrera_nombre 
                FROM materias m 
                LEFT JOIN carreras c ON m.carrera_id = c.id 
                WHERE m.carrera_id = ? AND m.anio = ? AND m.estado = 'activa' 
                ORDER BY m.cuatrimestre, m.nombre
            ");
            $stmt->execute([$carrera_id, $anio]);
            $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json');
            echo json_encode($materias);
        } catch (PDOException $e) {
            error_log("Error en getMateriasByAnio: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener materias']);
        }
    }

    public function getMateriaById($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT m.*, c.nombre as carrera_nombre 
                FROM materias m 
                LEFT JOIN carreras c ON m.carrera_id = c.id 
                WHERE m.id = ?
            ");
            $stmt->execute([$id]);
            $materia = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($materia) {
                header('Content-Type: application/json');
                echo json_encode($materia);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Materia no encontrada']);
            }
        } catch (PDOException $e) {
            error_log("Error en getMateriaById: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener materia']);
        }
    }

    public function createMateria() {
        $input = json_decode(file_get_contents('php://input'), true);

        // Validaciones
        if (!isset($input['nombre']) || empty(trim($input['nombre']))) {
            http_response_code(400);
            echo json_encode(['error' => 'El nombre de la materia es requerido']);
            return;
        }

        if (!isset($input['codigo']) || empty(trim($input['codigo']))) {
            http_response_code(400);
            echo json_encode(['error' => 'El código de la materia es requerido']);
            return;
        }

        if (!isset($input['carrera_id']) || empty($input['carrera_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'La carrera es requerida']);
            return;
        }

        if (!isset($input['anio']) || $input['anio'] < 1 || $input['anio'] > 6) {
            http_response_code(400);
            echo json_encode(['error' => 'El año debe estar entre 1 y 6']);
            return;
        }

        try {
            // Verificar que la carrera existe
            $stmt = $this->db->prepare("SELECT id FROM carreras WHERE id = ? AND estado = 'activa'");
            $stmt->execute([$input['carrera_id']]);
            if (!$stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'La carrera especificada no existe o está inactiva']);
                return;
            }

            $id = $this->generateUUID();
            
            $stmt = $this->db->prepare("
                INSERT INTO materias (id, nombre, codigo, descripcion, carrera_id, anio, cuatrimestre, horas_semanales, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id,
                trim($input['nombre']),
                trim($input['codigo']),
                $input['descripcion'] ?? null,
                $input['carrera_id'],
                $input['anio'],
                $input['cuatrimestre'] ?? 'anual',
                $input['horas_semanales'] ?? 4,
                $input['estado'] ?? 'activa'
            ]);

            header('Content-Type: application/json');
            echo json_encode([
                'id' => $id,
                'nombre' => $input['nombre'],
                'codigo' => $input['codigo'],
                'descripcion' => $input['descripcion'] ?? null,
                'carrera_id' => $input['carrera_id'],
                'anio' => $input['anio'],
                'cuatrimestre' => $input['cuatrimestre'] ?? 'anual',
                'horas_semanales' => $input['horas_semanales'] ?? 4,
                'estado' => $input['estado'] ?? 'activa',
                'created_at' => date('Y-m-d H:i:s')
            ]);
        } catch (PDOException $e) {
            error_log("Error en createMateria: " . $e->getMessage());
            
            if ($e->getCode() == 23000) { // Duplicate entry
                http_response_code(400);
                echo json_encode(['error' => 'Ya existe una materia con ese código']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al crear materia']);
            }
        }
    }

    public function updateMateria($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        // Validaciones
        if (!isset($input['nombre']) || empty(trim($input['nombre']))) {
            http_response_code(400);
            echo json_encode(['error' => 'El nombre de la materia es requerido']);
            return;
        }

        if (!isset($input['anio']) || $input['anio'] < 1 || $input['anio'] > 6) {
            http_response_code(400);
            echo json_encode(['error' => 'El año debe estar entre 1 y 6']);
            return;
        }

        try {
            $stmt = $this->db->prepare("
                UPDATE materias 
                SET nombre = ?, codigo = ?, descripcion = ?, carrera_id = ?, anio = ?, 
                    cuatrimestre = ?, horas_semanales = ?, estado = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            ");
            $result = $stmt->execute([
                trim($input['nombre']),
                trim($input['codigo']),
                $input['descripcion'] ?? null,
                $input['carrera_id'],
                $input['anio'],
                $input['cuatrimestre'] ?? 'anual',
                $input['horas_semanales'] ?? 4,
                $input['estado'] ?? 'activa',
                $id
            ]);

            if ($stmt->rowCount() > 0) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Materia actualizada correctamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Materia no encontrada']);
            }
        } catch (PDOException $e) {
            error_log("Error en updateMateria: " . $e->getMessage());
            
            if ($e->getCode() == 23000) { // Duplicate entry
                http_response_code(400);
                echo json_encode(['error' => 'Ya existe una materia con ese código']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al actualizar materia']);
            }
        }
    }

    public function deleteMateria($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM materias WHERE id = ?");
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() > 0) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Materia eliminada correctamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Materia no encontrada']);
            }
        } catch (PDOException $e) {
            error_log("Error en deleteMateria: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar materia']);
        }
    }

    private function generateUUID() {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
?>
