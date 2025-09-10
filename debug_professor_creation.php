<?php
// Script de debug para probar la creación de profesores
require_once 'api/config/database.php';

try {
    $database = new Database();
    $db = $database->pdo;
    
    // Verificar estructura de la tabla
    echo "=== ESTRUCTURA DE LA TABLA USUARIOS ===\n";
    $stmt = $db->prepare("DESCRIBE usuarios");
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "Campo: {$column['Field']} - Tipo: {$column['Type']} - Null: {$column['Null']}\n";
    }
    
    echo "\n=== PROBANDO INSERCIÓN DE PROFESOR ===\n";
    
    // Datos de prueba para profesor
    $testData = [
        'id' => 'test-prof-' . uniqid(),
        'email' => 'test.profesor@test.com',
        'name' => 'Profesor Test',
        'apellidos' => 'Apellido Test',
        'role' => 'profesor',
        'password_hash' => password_hash('test123', PASSWORD_DEFAULT),
        'dni' => '12345678',
        'legajo' => null,
        'carrera_id' => null,
        'telefono' => '+54 11 1234-5678',
        'departamento' => 'Informática',
        'especialidad' => 'Programación',
        'fechaNacimiento' => null,
        'fechaInscripcion' => null,
        'estado' => 'activo',
        'calle' => null,
        'ciudad' => null,
        'provincia' => null,
        'codigoPostal' => null,
        'contacto_emergencia_nombre' => null,
        'contacto_emergencia_telefono' => null,
        'contacto_emergencia_parentesco' => null
    ];
    
    // Intentar inserción
    $stmt = $db->prepare("INSERT INTO usuarios (
        id, email, name, apellidos, role, password_hash, 
        dni, legajo, carrera_id, telefono, departamento, especialidad,
        fechaNacimiento, fechaInscripcion, estado, 
        calle, ciudad, provincia, codigoPostal,
        contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_parentesco
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $result = $stmt->execute([
        $testData['id'],
        $testData['email'],
        $testData['name'],
        $testData['apellidos'],
        $testData['role'],
        $testData['password_hash'],
        $testData['dni'],
        $testData['legajo'],
        $testData['carrera_id'],
        $testData['telefono'],
        $testData['departamento'],
        $testData['especialidad'],
        $testData['fechaNacimiento'],
        $testData['fechaInscripcion'],
        $testData['estado'],
        $testData['calle'],
        $testData['ciudad'],
        $testData['provincia'],
        $testData['codigoPostal'],
        $testData['contacto_emergencia_nombre'],
        $testData['contacto_emergencia_telefono'],
        $testData['contacto_emergencia_parentesco']
    ]);
    
    if ($result) {
        echo "✅ ÉXITO: Profesor creado correctamente\n";
        echo "ID: {$testData['id']}\n";
        
        // Verificar que se guardó
        $stmt = $db->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmt->execute([$testData['id']]);
        $profesor = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "Datos guardados:\n";
        echo "- Nombre: {$profesor['name']}\n";
        echo "- Email: {$profesor['email']}\n";
        echo "- Rol: {$profesor['role']}\n";
        echo "- Especialidad: {$profesor['especialidad']}\n";
        echo "- Departamento: {$profesor['departamento']}\n";
        echo "- Teléfono: {$profesor['telefono']}\n";
        
        // Limpiar datos de prueba
        $stmt = $db->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt->execute([$testData['id']]);
        echo "\n🧹 Datos de prueba eliminados\n";
        
    } else {
        echo "❌ ERROR: No se pudo crear el profesor\n";
        print_r($stmt->errorInfo());
    }
    
} catch (Exception $e) {
    echo "❌ EXCEPCIÓN: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
}
?>
