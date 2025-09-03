<?php
class StudentController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->connect();
    }

    public function getAll() {
        try {
            // Verificar filtros
            $carrera = $_GET['carrera'] ?? null;
            $estado = $_GET['estado'] ?? null;

            $sql = "SELECT * FROM estudiantes";
            $params = [];

            if ($carrera) {
                $sql .= " WHERE carrera = ?";
                $params[] = $carrera;
            } elseif ($estado) {
                $sql .= " WHERE estado = ?";
                $params[] = $estado;
            }

            $sql .= " ORDER BY apellidos, nombres";

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $estudiantes = $stmt->fetchAll();

            // Formatear datos para compatibilidad con Angular
            $result = array_map([$this, 'formatStudent'], $estudiantes);
            echo json_encode($result);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener estudiantes']);
        }
    }

    public function getById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM estudiantes WHERE id = ?");
            $stmt->execute([$id]);
            $estudiante = $stmt->fetch();

            if ($estudiante) {
                echo json_encode($this->formatStudent($estudiante));
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Estudiante no encontrado']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener estudiante']);
        }
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$this->validateStudentData($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos de estudiante inválidos']);
            return;
        }

        try {
            $id = $this->generateUUID();
            
            $stmt = $this->db->prepare("
                INSERT INTO estudiantes (
                    id, legajo, nombres, apellidos, email, telefono, dni, 
                    fecha_nacimiento, carrera, fecha_inscripcion, estado,
                    direccion_calle, direccion_ciudad, direccion_provincia, direccion_codigo_postal,
                    contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_parentesco
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $id,
                $input['legajo'],
                $input['nombres'],
                $input['apellidos'],
                $input['email'],
                $input['telefono'] ?? null,
                $input['dni'],
                $input['fechaNacimiento'],
                $input['carrera'],
                $input['fechaInscripcion'],
                $input['estado'] ?? 'activo',
                $input['direccion']['calle'] ?? null,
                $input['direccion']['ciudad'] ?? null,
                $input['direccion']['provincia'] ?? null,
                $input['direccion']['codigoPostal'] ?? null,
                $input['contactoEmergencia']['nombre'] ?? null,
                $input['contactoEmergencia']['telefono'] ?? null,
                $input['contactoEmergencia']['parentesco'] ?? null
            ]);

            // Obtener el estudiante creado
            $stmt = $this->db->prepare("SELECT * FROM estudiantes WHERE id = ?");
            $stmt->execute([$id]);
            $estudiante = $stmt->fetch();

            echo json_encode($this->formatStudent($estudiante));
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear estudiante: ' . $e->getMessage()]);
        }
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        try {
            $stmt = $this->db->prepare("
                UPDATE estudiantes SET 
                    legajo = ?, nombres = ?, apellidos = ?, email = ?, telefono = ?, dni = ?,
                    fecha_nacimiento = ?, carrera = ?, fecha_inscripcion = ?, estado = ?,
                    direccion_calle = ?, direccion_ciudad = ?, direccion_provincia = ?, direccion_codigo_postal = ?,
                    contacto_emergencia_nombre = ?, contacto_emergencia_telefono = ?, contacto_emergencia_parentesco = ?
                WHERE id = ?
            ");

            $stmt->execute([
                $input['legajo'],
                $input['nombres'],
                $input['apellidos'],
                $input['email'],
                $input['telefono'] ?? null,
                $input['dni'],
                $input['fechaNacimiento'],
                $input['carrera'],
                $input['fechaInscripcion'],
                $input['estado'] ?? 'activo',
                $input['direccion']['calle'] ?? null,
                $input['direccion']['ciudad'] ?? null,
                $input['direccion']['provincia'] ?? null,
                $input['direccion']['codigoPostal'] ?? null,
                $input['contactoEmergencia']['nombre'] ?? null,
                $input['contactoEmergencia']['telefono'] ?? null,
                $input['contactoEmergencia']['parentesco'] ?? null,
                $id
            ]);

            // Obtener el estudiante actualizado
            $stmt = $this->db->prepare("SELECT * FROM estudiantes WHERE id = ?");
            $stmt->execute([$id]);
            $estudiante = $stmt->fetch();

            if ($estudiante) {
                echo json_encode($this->formatStudent($estudiante));
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Estudiante no encontrado']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar estudiante']);
        }
    }

    public function delete($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM estudiantes WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Estudiante eliminado correctamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Estudiante no encontrado']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar estudiante']);
        }
    }

    private function formatStudent($estudiante) {
        return [
            'id' => $estudiante['id'],
            'legajo' => $estudiante['legajo'],
            'nombres' => $estudiante['nombres'],
            'apellidos' => $estudiante['apellidos'],
            'email' => $estudiante['email'],
            'telefono' => $estudiante['telefono'],
            'dni' => $estudiante['dni'],
            'fechaNacimiento' => $estudiante['fecha_nacimiento'],
            'carrera' => $estudiante['carrera'],
            'fechaInscripcion' => $estudiante['fecha_inscripcion'],
            'estado' => $estudiante['estado'],
            'direccion' => [
                'calle' => $estudiante['direccion_calle'],
                'ciudad' => $estudiante['direccion_ciudad'],
                'provincia' => $estudiante['direccion_provincia'],
                'codigoPostal' => $estudiante['direccion_codigo_postal']
            ],
            'contactoEmergencia' => [
                'nombre' => $estudiante['contacto_emergencia_nombre'],
                'telefono' => $estudiante['contacto_emergencia_telefono'],
                'parentesco' => $estudiante['contacto_emergencia_parentesco']
            ]
        ];
    }

    private function validateStudentData($data) {
        return isset($data['legajo']) && 
               isset($data['nombres']) && 
               isset($data['apellidos']) && 
               isset($data['email']) && 
               isset($data['dni']) && 
               isset($data['fechaNacimiento']) && 
               isset($data['carrera']) && 
               isset($data['fechaInscripcion']);
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
