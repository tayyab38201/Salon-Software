<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all staff
        $stmt = $conn->prepare("SELECT * FROM staff ORDER BY name");
        $stmt->execute();
        $staff = $stmt->fetchAll();
        
        echo json_encode($staff);
        break;
        
    case 'POST':
        // Create new staff member
        $data = $_POST;
        
        $stmt = $conn->prepare("
            INSERT INTO staff (name, position, email, phone)
            VALUES (:name, :position, :email, :phone)
        ");
        
        try {
            $stmt->execute([
                ':name' => $data['name'],
                ':position' => $data['position'],
                ':email' => $data['email'],
                ':phone' => $data['phone']
            ]);
            
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
        
    case 'PUT':
        // Update staff member
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $conn->prepare("
            UPDATE staff 
            SET name = :name, position = :position, email = :email, phone = :phone
            WHERE id = :id
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':position' => $data['position'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':id' => $data['id']
        ]);
        
        echo json_encode(['success' => true]);
        break;
        
    case 'DELETE':
        // Delete staff member
        $id = $_GET['id'];
        
        $stmt = $conn->prepare("DELETE FROM staff WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        echo json_encode(['success' => true]);
        break;
}
?>