<?php
error_reporting(0);
require_once 'config.php';

try {
    $conn = getConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch($method) {
        case 'GET':
            $search = $_GET['search'] ?? '';
            $status = $_GET['status'] ?? '';
            $date = $_GET['date'] ?? '';
            
            $sql = "SELECT b.id, c.name as customer_name, s.name as service_name, s.price, st.name as staff_name, b.booking_date, b.booking_time, b.status 
                    FROM bookings b 
                    JOIN customers c ON b.customer_id = c.id 
                    JOIN services s ON b.service_id = s.id 
                    JOIN staff st ON b.staff_id = st.id 
                    WHERE 1=1";
            
            $params = [];
            
            if (!empty($search)) {
                $sql .= " AND (c.name LIKE ? OR s.name LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            
            if (!empty($status)) {
                $sql .= " AND b.status = ?";
                $params[] = $status;
            }
            
            if (!empty($date)) {
                $sql .= " AND b.booking_date = ?";
                $params[] = $date;
            }
            
            $sql .= " ORDER BY b.booking_date DESC, b.booking_time DESC";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($bookings);
            break;
            
        case 'POST':
            $customer_id = $_POST['customer_id'] ?? 0;
            $service_id = $_POST['service_id'] ?? 0;
            $staff_id = $_POST['staff_id'] ?? 0;
            $booking_date = $_POST['booking_date'] ?? '';
            $booking_time = $_POST['booking_time'] ?? '';
            $status = $_POST['status'] ?? 'pending';
            
            $stmt = $conn->prepare("INSERT INTO bookings (customer_id, service_id, staff_id, booking_date, booking_time, status) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$customer_id, $service_id, $staff_id, $booking_date, $booking_time, $status]);
            
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? 0;
            $status = $data['status'] ?? '';
            
            $stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            $id = $_GET['id'] ?? 0;
            
            $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true]);
            break;
    }
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>