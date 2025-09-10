<?php
// Script de prueba para verificar el router
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

echo json_encode([
    'status' => 'Router test working',
    'request_uri' => $_SERVER['REQUEST_URI'],
    'path_info' => isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : 'not set',
    'query_string' => $_SERVER['QUERY_STRING'],
    'method' => $_SERVER['REQUEST_METHOD'],
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
