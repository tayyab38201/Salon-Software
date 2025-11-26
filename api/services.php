<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all services
        $stmt = $conn->prepare("SELECT * FROM services ORDER BY name");
        $stmt->execute();
        $services = $stmt->fetchAll();
        
        echo json_encode($services);
        break;
        
    case 'POST':
        // Create new service
        $data = $_POST;
        
        $stmt = $conn->prepare("
            INSERT INTO services (name, description, price, duration, icon)
            VALUES (:name, :description, :price, :duration, :icon)
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':description' => $data['description'] ?? '',
            ':price' => $data['price'],
            ':duration' => $data['duration'],
            ':icon' => $data['icon'] ?? 'cut'
        ]);
        
        echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
        break;
        
    case 'PUT':
        // Update service
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $conn->prepare("
            UPDATE services 
            SET name = :name, description = :description, price = :price, 
                duration = :duration, icon = :icon
            WHERE id = :id
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':description' => $data['description'],
            ':price' => $data['price'],
            ':duration' => $data['duration'],
            ':icon' => $data['icon'],
            ':id' => $data['id']
        ]);
        
        echo json_encode(['success' => true]);
        break;
        
    case 'DELETE':
        // Delete service
        $id = $_GET['id'];
        
        $stmt = $conn->prepare("DELETE FROM services WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        echo json_encode(['success' => true]);
        break;
}
?>