<?php
// Test simple para diagnosticar el problema de asignaciones
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    echo "Iniciando test...\n";
    
    // Test 1: Verificar si existe el archivo de configuración
    $config_path = __DIR__ . '/config/database.php';
    echo "Config path: " . $config_path . "\n";
    echo "Config exists: " . (file_exists($config_path) ? 'YES' : 'NO') . "\n";
    
    if (file_exists($config_path)) {
        require_once $config_path;
        echo "Config loaded successfully\n";
        
        // Test 2: Verificar conexión a base de datos
        $db = new Database();
        echo "Database connection: SUCCESS\n";
        
        // Test 3: Verificar si existen las tablas
        $tables_to_check = ['materia_profesores', 'materia_estudiantes', 'materias', 'usuarios'];
        
        foreach ($tables_to_check as $table) {
            $sql = "SHOW TABLES LIKE '$table'";
            $stmt = $db->pdo->prepare($sql);
            $stmt->execute();
            $exists = $stmt->fetch() ? 'YES' : 'NO';
            echo "Table '$table' exists: $exists\n";
        }
        
        // Test 4: Verificar datos de prueba
        $sql = "SELECT COUNT(*) as count FROM materias";
        $stmt = $db->pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch();
        echo "Materias count: " . $result['count'] . "\n";
        
        $sql = "SELECT COUNT(*) as count FROM usuarios WHERE role = 'profesor'";
        $stmt = $db->pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch();
        echo "Profesores count: " . $result['count'] . "\n";
        
        $sql = "SELECT COUNT(*) as count FROM usuarios WHERE role = 'student'";
        $stmt = $db->pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch();
        echo "Estudiantes count: " . $result['count'] . "\n";
        
    } else {
        echo "ERROR: Config file not found!\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
