<?php
require_once __DIR__ . '/../config/database.php';

class CarrerasController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->pdo;
    }

    public function getCarreras() {
        try {
            $stmt = $this->db->prepare("SELECT * FROM carreras WHERE estado = 'activa' ORDER BY nombre");
            $stmt->execute();
            $carreras = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json');
            echo json_encode($carreras);
        } catch (PDOException $e) {
            error_log("Error en getCarreras: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener carreras']);
        }
    }

    public function getCarreraById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM carreras WHERE id = ?");
            $stmt->execute([$id]);
            $carrera = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($carrera) {
                header('Content-Type: application/json');
                echo json_encode($carrera);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Carrera no encontrada']);
            }
        } catch (PDOException $e) {
            error_log("Error en getCarreraById: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener carrera']);
        }
    }

    public function createCarrera() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['nombre']) || empty(trim($input['nombre']))) {
            http_response_code(400);
            echo json_encode(['error' => 'El nombre de la carrera es requerido']);
            return;
        }

        try {
            $id = $this->generateUUID();
            
            $stmt = $this->db->prepare("INSERT INTO carreras (id, nombre, descripcion, duracion_anios, estado) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $id,
                trim($input['nombre']),
                $input['descripcion'] ?? null,
                $input['duracion_anios'] ?? 3,
                $input['estado'] ?? 'activa'
            ]);

            header('Content-Type: application/json');
            echo json_encode([
                'id' => $id,
                'nombre' => $input['nombre'],
                'descripcion' => $input['descripcion'] ?? null,
                'duracion_anios' => $input['duracion_anios'] ?? 3,
                'estado' => $input['estado'] ?? 'activa',
                'created_at' => date('Y-m-d H:i:s')
            ]);
        } catch (PDOException $e) {
            error_log("Error en createCarrera: " . $e->getMessage());
            
            if ($e->getCode() == 23000) { // Duplicate entry
                http_response_code(400);
                echo json_encode(['error' => 'Ya existe una carrera con ese nombre']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al crear carrera']);
            }
        }
    }

    public function updateCarrera($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['nombre']) || empty(trim($input['nombre']))) {
            http_response_code(400);
            echo json_encode(['error' => 'El nombre de la carrera es requerido']);
            return;
        }

        try {
            $stmt = $this->db->prepare("UPDATE carreras SET nombre = ?, descripcion = ?, duracion_anios = ?, estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $result = $stmt->execute([
                trim($input['nombre']),
                $input['descripcion'] ?? null,
                $input['duracion_anios'] ?? 3,
                $input['estado'] ?? 'activa',
                $id
            ]);

            if ($stmt->rowCount() > 0) {
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Carrera actualizada correctamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Carrera no encontrada']);
            }
        } catch (PDOException $e) {
            error_log("Error en updateCarrera: " . $e->getMessage());
            
            if ($e->getCode() == 23000) { // Duplicate entry
                http_response_code(400);
                echo json_encode(['error' => 'Ya existe una carrera con ese nombre']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al actualizar carrera']);
            }
        }
    }

    public function deleteCarrera($id) {
        try {
            // Verificar si hay estudiantes o materias asociadas
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM usuarios WHERE carrera_id = ?");
            $stmt->execute([$id]);
            $estudiantesCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM materias WHERE carrera_id = ?");
            $stmt->execute([$id]);
            $materiasCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

            if ($estudiantesCount > 0 || $materiasCount > 0) {
                // Soft delete - cambiar estado a inactiva
                $stmt = $this->db->prepare("UPDATE carreras SET estado = 'inactiva', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->execute([$id]);
                
                header('Content-Type: application/json');
                echo json_encode(['message' => 'Carrera desactivada (tiene estudiantes o materias asociadas)']);
            } else {
                // Hard delete
                $stmt = $this->db->prepare("DELETE FROM carreras WHERE id = ?");
                $stmt->execute([$id]);
                
                if ($stmt->rowCount() > 0) {
                    header('Content-Type: application/json');
                    echo json_encode(['message' => 'Carrera eliminada correctamente']);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Carrera no encontrada']);
                }
            }
        } catch (PDOException $e) {
            error_log("Error en deleteCarrera: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar carrera']);
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
