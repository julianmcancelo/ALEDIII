<?php
/**
 * NoticiasController - Controlador para gestión de noticias
 * Maneja CRUD completo de noticias del instituto
 */

require_once __DIR__ . '/../config/database.php';

class NoticiasController {
    private $db;
    
    public function __construct() {
        $this->db = getDBConnection();
    }
    
    /**
     * Obtener todas las noticias con paginación
     */
    public function getNoticiasAdmin() {
        try {
            $stmt = $this->db->prepare("
                SELECT id, titulo, resumen, contenido, imagen_url, fecha_publicacion, 
                       autor, estado, categoria, fecha_creacion, fecha_actualizacion
                FROM noticias 
                ORDER BY fecha_creacion DESC
            ");
            
            $stmt->execute();
            $noticias = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'data' => $noticias
            ]);
            return;
            
        } catch (Exception $e) {
            error_log("Error al obtener noticias admin: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener las noticias'
            ]);
        }
    }
    
    /**
     * Obtener noticias para el dashboard (incluye borradores)
     */
    public function getNoticiasPublicas() {
        try {
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $offset = ($page - 1) * $limit;
            
            $stmt = $this->db->prepare("
                SELECT id, titulo, resumen, contenido, imagen_url, fecha_publicacion, 
                       autor, estado, categoria, fecha_creacion, fecha_actualizacion
                FROM noticias 
                WHERE estado = 'publicada'
                ORDER BY fecha_publicacion DESC
                LIMIT :limit OFFSET :offset
            ");
            
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $noticias = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Obtener total de noticias para paginación
            $countStmt = $this->db->prepare("SELECT COUNT(*) as total FROM noticias WHERE estado = 'publicada'");
            $countStmt->execute();
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            echo json_encode([
                'success' => true,
                'data' => $noticias,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => ceil($total / $limit),
                    'total_items' => $total,
                    'items_per_page' => $limit
                ]
            ]);
            return;
            
        } catch (Exception $e) {
            error_log("Error al obtener noticias públicas: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener las noticias'
            ]);
        }
    }
    
    /**
     * Obtener una noticia por ID
     */
    public function getNoticiaById($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT id, titulo, resumen, contenido, imagen_url, fecha_publicacion, 
                       autor, estado, categoria, fecha_creacion, fecha_actualizacion
                FROM noticias 
                WHERE id = :id
            ");
            
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $noticia = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($noticia) {
                echo json_encode([
                    'success' => true,
                    'data' => $noticia
                ]);
                return;
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Noticia no encontrada'
                ]);
                return;
            }
            
        } catch (Exception $e) {
            error_log("Error al obtener noticia: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener la noticia'
            ]);
        }
    }
    
    /**
     * Crear nueva noticia
     */
    public function crearNoticia() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validar campos requeridos
            if (empty($input['titulo']) || empty($input['resumen']) || empty($input['contenido'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Título, resumen y contenido son obligatorios'
                ]);
                return;
            }
            
            $stmt = $this->db->prepare("
                INSERT INTO noticias (titulo, resumen, contenido, imagen_url, fecha_publicacion, 
                                    autor, estado, categoria, fecha_creacion, fecha_actualizacion)
                VALUES (:titulo, :resumen, :contenido, :imagen_url, :fecha_publicacion, 
                        :autor, :estado, :categoria, NOW(), NOW())
            ");
            
            $fecha_publicacion = $input['fecha_publicacion'] ?? date('Y-m-d H:i:s');
            $estado = $input['estado'] ?? 'borrador';
            $categoria = $input['categoria'] ?? 'general';
            $autor = $input['autor'] ?? 'Administrador';
            
            $stmt->bindParam(':titulo', $input['titulo']);
            $stmt->bindParam(':resumen', $input['resumen']);
            $stmt->bindParam(':contenido', $input['contenido']);
            $stmt->bindParam(':imagen_url', $input['imagen_url']);
            $stmt->bindParam(':fecha_publicacion', $fecha_publicacion);
            $stmt->bindParam(':autor', $autor);
            $stmt->bindParam(':estado', $estado);
            $stmt->bindParam(':categoria', $categoria);
            
            if ($stmt->execute()) {
                $noticiaId = $this->db->lastInsertId();
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Noticia creada exitosamente',
                    'data' => ['id' => $noticiaId]
                ]);
                return;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Error al crear la noticia'
                ]);
            }
            
        } catch (Exception $e) {
            error_log("Error al crear noticia: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al crear la noticia'
            ]);
        }
    }
    
    /**
     * Actualizar noticia existente
     */
    public function actualizarNoticia($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validar campos requeridos
            if (empty($input['titulo']) || empty($input['resumen']) || empty($input['contenido'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Título, resumen y contenido son obligatorios'
                ]);
                return;
            }
            
            $stmt = $this->db->prepare("
                UPDATE noticias 
                SET titulo = :titulo, resumen = :resumen, contenido = :contenido, 
                    imagen_url = :imagen_url, fecha_publicacion = :fecha_publicacion,
                    autor = :autor, estado = :estado, categoria = :categoria,
                    fecha_actualizacion = NOW()
                WHERE id = :id
            ");
            
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':titulo', $input['titulo']);
            $stmt->bindParam(':resumen', $input['resumen']);
            $stmt->bindParam(':contenido', $input['contenido']);
            $stmt->bindParam(':imagen_url', $input['imagen_url']);
            $stmt->bindParam(':fecha_publicacion', $input['fecha_publicacion']);
            $stmt->bindParam(':autor', $input['autor']);
            $stmt->bindParam(':estado', $input['estado']);
            $stmt->bindParam(':categoria', $input['categoria']);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Noticia actualizada exitosamente'
                ]);
                return;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Error al actualizar la noticia'
                ]);
                return;
            }
            
        } catch (Exception $e) {
            error_log("Error al actualizar noticia: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al actualizar la noticia'
            ]);
        }
    }
    
    /**
     * Eliminar noticia
     */
    public function eliminarNoticia($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM noticias WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Noticia eliminada exitosamente'
                ]);
                return;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Error al eliminar la noticia'
                ]);
                return;
            }
            
        } catch (Exception $e) {
            error_log("Error al eliminar noticia: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al eliminar la noticia'
            ]);
        }
    }
    
    /**
     * Cambiar estado de una noticia (publicar/despublicar)
     */
    public function cambiarEstadoNoticia($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $nuevoEstado = $input['estado'] ?? 'borrador';
            
            $stmt = $this->db->prepare("
                UPDATE noticias 
                SET estado = :estado, fecha_actualizacion = NOW()
                WHERE id = :id
            ");
            
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':estado', $nuevoEstado);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Estado de la noticia actualizado exitosamente'
                ]);
                return;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Error al cambiar el estado de la noticia'
                ]);
                return;
            }
            
        } catch (Exception $e) {
            error_log("Error al cambiar estado de noticia: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al cambiar el estado de la noticia'
            ]);
        }
    }
}
