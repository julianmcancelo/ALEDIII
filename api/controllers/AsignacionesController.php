<?php
require_once __DIR__ . '/../config/database.php';

class AsignacionesController {
    private $db;

    public function __construct() {
        try {
            error_log("AsignacionesController - Initializing Database connection");
            $this->db = new Database();
            error_log("AsignacionesController - Database connection successful");
        } catch (Exception $e) {
            error_log("AsignacionesController - Database connection failed: " . $e->getMessage());
            throw $e;
        }
    }

    // Obtener profesores asignados a una materia
    public function getProfesoresByMateria($materia_id) {
        try {
            error_log("AsignacionesController - getProfesoresByMateria called with ID: " . $materia_id);
            
            $sql = "SELECT u.id, u.name, u.email, u.especialidad, mp.tipo_asignacion, mp.fecha_asignacion
                    FROM materia_profesores mp
                    JOIN usuarios u ON mp.profesor_id = u.id
                    WHERE mp.materia_id = :materia_id AND mp.activo = 1 AND u.role = 'profesor'
                    ORDER BY mp.tipo_asignacion, u.name";
            
            error_log("AsignacionesController - SQL: " . $sql);
            
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->bindParam(':materia_id', $materia_id);
            $stmt->execute();
            
            $result = $stmt->fetchAll();
            error_log("AsignacionesController - Profesores found: " . count($result));
            
            return $result;
        } catch (PDOException $e) {
            error_log("AsignacionesController - PDO Error: " . $e->getMessage());
            http_response_code(500);
            return ['error' => 'Error al obtener profesores: ' . $e->getMessage()];
        }
    }

    // Obtener estudiantes asignados a una materia
    public function getEstudiantesByMateria($materia_id) {
        try {
            error_log("AsignacionesController - getEstudiantesByMateria called with ID: " . $materia_id);
            
            $sql = "SELECT u.id, u.name, u.email, u.dni, me.estado, me.fecha_inscripcion, me.nota_final
                FROM materia_estudiantes me
                JOIN usuarios u ON me.estudiante_id = u.id
                WHERE me.materia_id = :materia_id AND me.activo = 1 AND u.role = 'student'
                ORDER BY u.name";
            
            error_log("AsignacionesController - SQL: " . $sql);
            
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->bindParam(':materia_id', $materia_id);
            $stmt->execute();
            
            $result = $stmt->fetchAll();
            error_log("AsignacionesController - Estudiantes found: " . count($result));
            
            return $result;
        } catch (PDOException $e) {
            error_log("AsignacionesController - PDO Error: " . $e->getMessage());
            http_response_code(500);
            return ['error' => 'Error al obtener estudiantes: ' . $e->getMessage()];
        }
    }

    // Asignar profesor a materia
    public function asignarProfesor() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            error_log("AsignacionesController - asignarProfesor input: " . json_encode($input));
            
            if (!isset($input['materia_id']) || !isset($input['profesor_id'])) {
                error_log("AsignacionesController - Missing required fields");
                http_response_code(400);
                return ['error' => 'Materia ID y Profesor ID son requeridos'];
            }

            $materia_id = $input['materia_id'];
            $profesor_id = $input['profesor_id'];
            $tipo_asignacion = $input['tipo_asignacion'] ?? 'titular';

            // Verificar si ya existe la asignación
            $checkSql = "SELECT id FROM materia_profesores WHERE materia_id = :materia_id AND profesor_id = :profesor_id";
            $checkStmt = $this->db->pdo->prepare($checkSql);
            $checkStmt->bindParam(':materia_id', $materia_id);
            $checkStmt->bindParam(':profesor_id', $profesor_id);
            $checkStmt->execute();

            if ($checkStmt->fetch()) {
                http_response_code(409);
                return ['error' => 'El profesor ya está asignado a esta materia'];
            }

            // Insertar nueva asignación
            $sql = "INSERT INTO materia_profesores (id, materia_id, profesor_id, tipo_asignacion) 
                    VALUES (UUID(), :materia_id, :profesor_id, :tipo_asignacion)";
            
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->bindParam(':materia_id', $materia_id);
            $stmt->bindParam(':profesor_id', $profesor_id);
            $stmt->bindParam(':tipo_asignacion', $tipo_asignacion);
            
            if ($stmt->execute()) {
                return ['message' => 'Profesor asignado correctamente'];
            } else {
                http_response_code(500);
                return ['error' => 'Error al asignar profesor'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Error al asignar profesor: ' . $e->getMessage()];
        }
    }

    // Asignar estudiante a materia
    public function asignarEstudiante() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            error_log("AsignacionesController - asignarEstudiante input: " . json_encode($input));
            
            if (!isset($input['materia_id']) || !isset($input['estudiante_id'])) {
                error_log("AsignacionesController - Missing required fields");
                http_response_code(400);
                return ['error' => 'Materia ID y Estudiante ID son requeridos'];
            }

            $materia_id = $input['materia_id'];
            $estudiante_id = $input['estudiante_id'];
            $estado = $input['estado'] ?? 'inscrito';

            // Verificar si ya existe la asignación
            $checkSql = "SELECT id FROM materia_estudiantes WHERE materia_id = :materia_id AND estudiante_id = :estudiante_id";
            $checkStmt = $this->db->pdo->prepare($checkSql);
            $checkStmt->bindParam(':materia_id', $materia_id);
            $checkStmt->bindParam(':estudiante_id', $estudiante_id);
            $checkStmt->execute();

            if ($checkStmt->fetch()) {
                http_response_code(409);
                return ['error' => 'El estudiante ya está inscrito en esta materia'];
            }

            // Insertar nueva asignación
            $sql = "INSERT INTO materia_estudiantes (id, materia_id, estudiante_id, estado) 
                    VALUES (UUID(), :materia_id, :estudiante_id, :estado)";
            
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->bindParam(':materia_id', $materia_id);
            $stmt->bindParam(':estudiante_id', $estudiante_id);
            $stmt->bindParam(':estado', $estado);
            
            if ($stmt->execute()) {
                return ['message' => 'Estudiante inscrito correctamente'];
            } else {
                http_response_code(500);
                return ['error' => 'Error al inscribir estudiante'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Error al inscribir estudiante: ' . $e->getMessage()];
        }
    }

    // Asignación masiva de profesores
    public function asignacionMasivaProfesores() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['asignaciones']) || !is_array($input['asignaciones'])) {
                http_response_code(400);
                return ['error' => 'Array de asignaciones es requerido'];
            }

            $this->db->pdo->beginTransaction();
            $exitosas = 0;
            $errores = [];

            foreach ($input['asignaciones'] as $asignacion) {
                try {
                    if (!isset($asignacion['materia_id']) || !isset($asignacion['profesor_id'])) {
                        $errores[] = 'Asignación inválida: faltan datos requeridos';
                        continue;
                    }

                    $tipo_asignacion = $asignacion['tipo_asignacion'] ?? 'titular';

                    // Verificar si ya existe
                    $checkSql = "SELECT id FROM materia_profesores WHERE materia_id = :materia_id AND profesor_id = :profesor_id";
                    $checkStmt = $this->db->pdo->prepare($checkSql);
                    $checkStmt->bindParam(':materia_id', $asignacion['materia_id']);
                    $checkStmt->bindParam(':profesor_id', $asignacion['profesor_id']);
                    $checkStmt->execute();

                    if ($checkStmt->fetch()) {
                        $errores[] = "Profesor ya asignado a materia {$asignacion['materia_id']}";
                        continue;
                    }

                    // Insertar asignación
                    $sql = "INSERT INTO materia_profesores (id, materia_id, profesor_id, tipo_asignacion) 
                            VALUES (UUID(), :materia_id, :profesor_id, :tipo_asignacion)";
                    
                    $stmt = $this->db->pdo->prepare($sql);
                    $stmt->bindParam(':materia_id', $asignacion['materia_id']);
                    $stmt->bindParam(':profesor_id', $asignacion['profesor_id']);
                    $stmt->bindParam(':tipo_asignacion', $tipo_asignacion);
                    
                    if ($stmt->execute()) {
                        $exitosas++;
                    }
                } catch (PDOException $e) {
                    $errores[] = "Error en asignación: " . $e->getMessage();
                }
            }

            $this->db->pdo->commit();
            
            return [
                'message' => "Asignación masiva completada",
                'exitosas' => $exitosas,
                'errores' => $errores
            ];
        } catch (Exception $e) {
            $this->db->pdo->rollBack();
            http_response_code(500);
            return ['error' => 'Error en asignación masiva: ' . $e->getMessage()];
        }
    }

    // Asignación masiva de estudiantes
    public function asignacionMasivaEstudiantes() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['asignaciones']) || !is_array($input['asignaciones'])) {
                http_response_code(400);
                return ['error' => 'Array de asignaciones es requerido'];
            }

            $this->db->pdo->beginTransaction();
            $exitosas = 0;
            $errores = [];

            foreach ($input['asignaciones'] as $asignacion) {
                try {
                    if (!isset($asignacion['materia_id']) || !isset($asignacion['estudiante_id'])) {
                        $errores[] = 'Asignación inválida: faltan datos requeridos';
                        continue;
                    }

                    $estado = $asignacion['estado'] ?? 'inscrito';

                    // Verificar si ya existe
                    $checkSql = "SELECT id FROM materia_estudiantes WHERE materia_id = :materia_id AND estudiante_id = :estudiante_id";
                    $checkStmt = $this->db->pdo->prepare($checkSql);
                    $checkStmt->bindParam(':materia_id', $asignacion['materia_id']);
                    $checkStmt->bindParam(':estudiante_id', $asignacion['estudiante_id']);
                    $checkStmt->execute();

                    if ($checkStmt->fetch()) {
                        $errores[] = "Estudiante ya inscrito en materia {$asignacion['materia_id']}";
                        continue;
                    }

                    // Insertar asignación
                    $sql = "INSERT INTO materia_estudiantes (id, materia_id, estudiante_id, estado) 
                            VALUES (UUID(), :materia_id, :estudiante_id, :estado)";
                    
                    $stmt = $this->db->pdo->prepare($sql);
                    $stmt->bindParam(':materia_id', $asignacion['materia_id']);
                    $stmt->bindParam(':estudiante_id', $asignacion['estudiante_id']);
                    $stmt->bindParam(':estado', $estado);
                    
                    if ($stmt->execute()) {
                        $exitosas++;
                    }
                } catch (PDOException $e) {
                    $errores[] = "Error en asignación: " . $e->getMessage();
                }
            }

            $this->db->pdo->commit();
            
            return [
                'message' => "Asignación masiva completada",
                'exitosas' => $exitosas,
                'errores' => $errores
            ];
        } catch (Exception $e) {
            $this->db->pdo->rollBack();
            http_response_code(500);
            return ['error' => 'Error en asignación masiva: ' . $e->getMessage()];
        }
    }

    // Remover asignación de profesor
    public function removerProfesor($materia_id, $profesor_id) {
        try {
            $sql = "UPDATE materia_profesores SET activo = 0 WHERE materia_id = :materia_id AND profesor_id = :profesor_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->bindParam(':materia_id', $materia_id);
            $stmt->bindParam(':profesor_id', $profesor_id);
            
            if ($stmt->execute()) {
                return ['message' => 'Profesor removido correctamente'];
            } else {
                http_response_code(500);
                return ['error' => 'Error al remover profesor'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Error al remover profesor: ' . $e->getMessage()];
        }
    }

    // Remover asignación de estudiante
    public function removerEstudiante($materia_id, $estudiante_id) {
        try {
            $sql = "UPDATE materia_estudiantes SET activo = 0 WHERE materia_id = :materia_id AND estudiante_id = :estudiante_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->bindParam(':materia_id', $materia_id);
            $stmt->bindParam(':estudiante_id', $estudiante_id);
            
            if ($stmt->execute()) {
                return ['message' => 'Estudiante removido correctamente'];
            } else {
                http_response_code(500);
                return ['error' => 'Error al remover estudiante'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Error al remover estudiante: ' . $e->getMessage()];
        }
    }
}
?>
