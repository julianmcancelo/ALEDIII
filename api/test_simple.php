<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Test 1: Verificar conexión a base de datos
    require_once 'config/database.php';
    $db = getDBConnection();
    
    // Test 2: Verificar que la tabla existe
    $stmt = $db->prepare("SHOW TABLES LIKE 'noticias'");
    $stmt->execute();
    $tableExists = $stmt->fetch();
    
    if (!$tableExists) {
        echo json_encode([
            'error' => 'Tabla noticias no existe',
            'step' => 'table_check'
        ]);
        exit;
    }
    
    // Test 3: Verificar que el controlador se puede instanciar
    require_once 'controllers/NoticiasController.php';
    $controller = new NoticiasController();
    
    // Test 4: Consulta simple
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM noticias");
    $stmt->execute();
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Todo funciona correctamente',
        'total_noticias' => $count['total'],
        'controller_loaded' => class_exists('NoticiasController')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>
