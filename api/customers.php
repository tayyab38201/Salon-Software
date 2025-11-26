<?php
error_reporting(0);
require_once 'config.php';

try {
    $conn = getConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method) {
        case 'GET':
            $search = $_GET['search'] ?? '';
            
            $sql = "SELECT c.*, COUNT(b.id) as total_visits, MAX(b.booking_date) as last_visit 
                    FROM customers c 
                    LEFT JOIN bookings b ON c.id = b.customer_id AND b.status = 'completed'";
            
            if (!empty($search)) {
                $sql .= " WHERE c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?";
            }
            
            $sql .= " GROUP BY c.id ORDER BY c.created_at DESC";
            
            $stmt = $conn->prepare($sql);
            
            if (!empty($search)) {
                $searchParam = "%$search%";
                $stmt->execute([$searchParam, $searchParam, $searchParam]);
            } else {
                $stmt->execute();
            }
            
            $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($customers);
            break;
            
        case 'POST':
            $name = $_POST['name'] ?? '';
            $email = $_POST['email'] ?? '';
            $phone = $_POST['phone'] ?? '';
            
            $stmt = $conn->prepare("INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $phone]);
            
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'DELETE':
            $id = $_GET['id'] ?? 0;
            
            $stmt = $conn->prepare("DELETE FROM customers WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true]);
            break;
    }
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

