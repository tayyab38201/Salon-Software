<?php
error_reporting(1);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once 'config.php';

try {
    $conn = getConnection();
    
    $email = $_GET['email'] ?? '';
    $phone = $_GET['phone'] ?? '';
    
    error_log("Check Status Called - Email: '$email', Phone: '$phone'");
    
    if (empty($email) && empty($phone)) {
        echo json_encode(['error' => 'Please provide email or phone']);
        exit;
    }
    
    // Build query
    $sql = "SELECT 
                b.id,
                b.booking_date,
                TIME_FORMAT(b.booking_time, '%h:%i %p') as booking_time,
                b.status,
                b.price,
                s.name as service_name,
                st.name as staff_name,
                c.email,
                c.phone
            FROM bookings b
            JOIN customers c ON b.customer_id = c.id
            JOIN services s ON b.service_id = s.id
            JOIN staff st ON b.staff_id = st.id
            WHERE ";
    
    $params = [];
    
    if (!empty($email) && !empty($phone)) {
        $sql .= "(c.email = ? OR c.phone = ?)";
        $params[] = $email;
        $params[] = $phone;
    } elseif (!empty($email)) {
        $sql .= "c.email = ?";
        $params[] = $email;
    } else {
        $sql .= "c.phone = ?";
        $params[] = $phone;
    }
    
    $sql .= " ORDER BY b.booking_date DESC, b.booking_time DESC";
    
    error_log("Query: $sql, Params: " . json_encode($params));
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    error_log("Bookings found: " . count($bookings));
    
    echo json_encode($bookings);
    
} catch(Exception $e) {
    error_log("Error in check_status.php: " . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);
}
?>