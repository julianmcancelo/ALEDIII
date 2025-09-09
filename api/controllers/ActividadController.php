<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../config/database.php';
require_once '../models/Actividad.php';

class ActividadController {
    private $database;
    private $db;
    private $actividad;

    public function __construct() {
        $this->database = new Database();
        $this->db = $this->database->connect();
        $this->actividad = new Actividad($this->db);
    }

    // Obtener actividades recientes
    public function getActividades() {
        // Obtener parámetros de la solicitud
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;
        
        // Ejecutar consulta
        $result = $this->actividad->getRecientes($limit);
        
        // Verificar si hay resultados
        $num = $result->rowCount();
        
        if($num > 0) {
            // Array de actividades
            $actividades_arr = array();
            
            while($row = $result->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                $actividad_item = array(
                    'id' => $id,
                    'tipo' => $tipo,
                    'mensaje' => $mensaje,
                    'fecha' => $fecha,
                    'detalles' => $detalles
                );
                
                array_push($actividades_arr, $actividad_item);
            }
            
            // Convertir a JSON y enviar respuesta
            echo json_encode($actividades_arr);
        } else {
            // No hay actividades
            echo json_encode(array('message' => 'No se encontraron actividades'));
        }
    }

    // Registrar nueva actividad
    public function crearActividad() {
        // Obtener datos enviados
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->tipo) && !empty($data->mensaje)) {
            // Asignar valores
            $this->actividad->tipo = $data->tipo;
            $this->actividad->mensaje = $data->mensaje;
            $this->actividad->detalles = isset($data->detalles) ? $data->detalles : null;
            $this->actividad->fecha = isset($data->fecha) ? $data->fecha : date('Y-m-d H:i:s');
            
            // Crear actividad
            if($this->actividad->crear()) {
                echo json_encode(array(
                    'id' => $this->actividad->id,
                    'tipo' => $this->actividad->tipo,
                    'mensaje' => $this->actividad->mensaje,
                    'fecha' => $this->actividad->fecha,
                    'detalles' => $this->actividad->detalles
                ));
            } else {
                echo json_encode(array('message' => 'No se pudo crear la actividad'));
            }
        } else {
            echo json_encode(array('message' => 'Datos incompletos'));
        }
    }
}

// Manejar la solicitud
$controller = new ActividadController();
$request_method = $_SERVER['REQUEST_METHOD'];

switch($request_method) {
    case 'GET':
        $controller->getActividades();
        break;
    case 'POST':
        $controller->crearActividad();
        break;
    case 'OPTIONS':
        // Permitir pre-flight desde el navegador
        http_response_code(200);
        break;
    default:
        // Método no permitido
        http_response_code(405);
        echo json_encode(array('message' => 'Método no permitido'));
        break;
}
?>
