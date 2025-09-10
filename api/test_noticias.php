<?php
// Test simple para verificar la conexión y tabla de noticias
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    require_once 'config/database.php';
    
    $db = getDBConnection();
    
    // Verificar si la tabla existe
    $stmt = $db->prepare("SHOW TABLES LIKE 'noticias'");
    $stmt->execute();
    $tableExists = $stmt->fetch();
    
    if (!$tableExists) {
        echo json_encode([
            'success' => false,
            'message' => 'Tabla noticias no existe'
        ]);
        exit;
    }
    
    // Probar consulta simple
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM noticias");
    $stmt->execute();
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Obtener algunas noticias
    $stmt = $db->prepare("SELECT id, titulo, estado FROM noticias LIMIT 3");
    $stmt->execute();
    $noticias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Conexión exitosa',
        'total_noticias' => $count['total'],
        'noticias_sample' => $noticias
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>
