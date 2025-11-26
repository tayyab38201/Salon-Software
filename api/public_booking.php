<?php
error_reporting(1);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once 'config.php';

try {
    $conn = getConnection();
    
    // Validate required fields
    if (!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['phone'])) {
        echo json_encode(['error' => 'Missing required fields', 'debug' => $_POST]);
        exit;
    }
    
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $service_id = $_POST['service_id'] ?? '';
    $staff_id = $_POST['staff_id'] ?? '';
    $booking_date = $_POST['booking_date'] ?? '';
    $booking_time = $_POST['booking_time'] ?? '';
    
    // Validate all fields are filled
    if (empty($name) || empty($email) || empty($phone) || empty($service_id) || empty($staff_id) || empty($booking_date) || empty($booking_time)) {
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }
    
    // Log for debugging
    error_log("Booking attempt: Email=$email, Phone=$phone, Date=$booking_date");
    
    // Check if customer exists
    $stmt = $conn->prepare("SELECT id FROM customers WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($customer) {
        $customerId = $customer['id'];
        error_log("Customer found: ID=$customerId");
        
        // Update phone if different
        $updateStmt = $conn->prepare("UPDATE customers SET phone = :phone WHERE id = :id");
        $updateStmt->execute([':phone' => $phone, ':id' => $customerId]);
    } else {
        // Create new customer
        $insertStmt = $conn->prepare("
            INSERT INTO customers (name, email, phone)
            VALUES (:name, :email, :phone)
        ");
        $insertStmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':phone' => $phone
        ]);
        $customerId = $conn->lastInsertId();
        error_log("Customer created: ID=$customerId");
    }
    
    // Get service price
    $serviceStmt = $conn->prepare("SELECT price FROM services WHERE id = :id");
    $serviceStmt->execute([':id' => $service_id]);
    $service = $serviceStmt->fetch(PDO::FETCH_ASSOC);
    $price = $service['price'] ?? 0;
    
    // Create booking
    $bookingStmt = $conn->prepare("
        INSERT INTO bookings (customer_id, service_id, staff_id, booking_date, booking_time, status, price)
        VALUES (:customer_id, :service_id, :staff_id, :booking_date, :booking_time, 'pending', :price)
    ");
    
    $success = $bookingStmt->execute([
        ':customer_id' => $customerId,
        ':service_id' => $service_id,
        ':staff_id' => $staff_id,
        ':booking_date' => $booking_date,
        ':booking_time' => $booking_time,
        ':price' => $price
    ]);
    
    if ($success) {
        $bookingId = $conn->lastInsertId();
        error_log("Booking created: ID=$bookingId");
        echo json_encode([
            'success' => true,
            'booking_id' => $bookingId,
            'message' => 'Booking created successfully!'
        ]);
    } else {
        echo json_encode(['error' => 'Failed to create booking']);
    }
    
} catch(Exception $e) {
    error_log("Error in public_booking.php: " . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);
}
?>