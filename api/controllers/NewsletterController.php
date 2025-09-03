<?php
class NewsletterController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->connect();
    }

    public function subscribe() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['email']) || empty($input['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email requerido']);
            return;
        }

        $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
        if (!$email) {
            http_response_code(400);
            echo json_encode(['error' => 'Email inválido']);
            return;
        }

        try {
            // Verificar si ya existe
            $stmt = $this->db->prepare("SELECT id FROM newsletter_subscriptions WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Email ya suscrito']);
                return;
            }

            // Insertar nueva suscripción
            $id = $this->generateUUID();
            $stmt = $this->db->prepare("INSERT INTO newsletter_subscriptions (id, email) VALUES (?, ?)");
            $stmt->execute([$id, $email]);

            echo json_encode([
                'id' => $id,
                'email' => $email,
                'subscribedAt' => date('Y-m-d H:i:s'),
                'message' => 'Suscripción exitosa'
            ]);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al procesar suscripción']);
        }
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
