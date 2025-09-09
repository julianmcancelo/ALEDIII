<?php
class Database {
    private $host = 'localhost';
    private $dbname = 'jcancelo_aled3';
    private $username = 'jcancelo_aled3';
    private $password = 'feeltehsky1';
    public $pdo;

    public function __construct() {
        $this->connect();
    }

    public function connect() {
        if ($this->pdo === null) {
            try {
                $this->pdo = new PDO(
                    "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4", 
                    $this->username, 
                    $this->password
                );
                $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
                exit();
            }
        }
        return $this->pdo;
    }

}
?>
