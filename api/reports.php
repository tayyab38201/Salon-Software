<?php
error_reporting(0);
require_once 'config.php';

try {
    $conn = getConnection();
    
    $startDate = $_GET['start_date'] ?? date('Y-m-01');
    $endDate = $_GET['end_date'] ?? date('Y-m-t');
    
    // Revenue
    $stmt = $conn->prepare("SELECT COALESCE(SUM(s.price), 0) as revenue FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.booking_date BETWEEN ? AND ? AND b.status = 'completed'");
    $stmt->execute([$startDate, $endDate]);
    $revenue = $stmt->fetch()['revenue'];
    
    // Bookings count
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM bookings WHERE booking_date BETWEEN ? AND ?");
    $stmt->execute([$startDate, $endDate]);
    $bookings = $stmt->fetch()['count'];
    
    // New customers
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM customers WHERE DATE(created_at) BETWEEN ? AND ?");
    $stmt->execute([$startDate, $endDate]);
    $newCustomers = $stmt->fetch()['count'];
    
    // Cancellation rate
    $stmt = $conn->prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled FROM bookings WHERE booking_date BETWEEN ? AND ?");
    $stmt->execute([$startDate, $endDate]);
    $result = $stmt->fetch();
    $cancellationRate = $result['total'] > 0 ? round(($result['cancelled'] / $result['total']) * 100, 2) : 0;
    
    echo json_encode([
        'revenue' => number_format($revenue, 2),
        'bookings' => $bookings,
        'newCustomers' => $newCustomers,
        'cancellationRate' => $cancellationRate
    ]);
    
} catch(Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>