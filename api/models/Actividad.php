<?php

class Actividad {
    private $conn;
    private $table = 'actividades';

    // Propiedades de la actividad
    public $id;
    public $tipo;
    public $mensaje;
    public $fecha;
    public $detalles;

    // Constructor con conexión a BD
    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener actividades recientes
    public function getRecientes($limit = 5) {
        $query = 'SELECT 
                    id, 
                    tipo, 
                    mensaje, 
                    fecha,
                    detalles
                  FROM ' . $this->table . '
                  ORDER BY fecha DESC
                  LIMIT :limit';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt;
    }

    // Crear nueva actividad
    public function crear() {
        $query = 'INSERT INTO ' . $this->table . '
                  (tipo, mensaje, fecha, detalles)
                  VALUES
                  (:tipo, :mensaje, :fecha, :detalles)';

        $stmt = $this->conn->prepare($query);

        // Limpiar datos
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->mensaje = htmlspecialchars(strip_tags($this->mensaje));
        $this->detalles = htmlspecialchars(strip_tags($this->detalles));

        // Si no se proporciona fecha, usar la fecha actual
        if(!$this->fecha) {
            $this->fecha = date('Y-m-d H:i:s');
        }

        // Bind parámetros
        $stmt->bindParam(':tipo', $this->tipo);
        $stmt->bindParam(':mensaje', $this->mensaje);
        $stmt->bindParam(':fecha', $this->fecha);
        $stmt->bindParam(':detalles', $this->detalles);

        // Ejecutar query
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        // Error al crear
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}
?>
