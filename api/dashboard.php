<?php
error_reporting(0);
require_once 'config.php';

try {
    $conn = getConnection();
    
    // Today's bookings (ALL)
    $stmt = $conn->query("SELECT COUNT(*) as count FROM bookings WHERE booking_date = CURDATE()");
    $todayBookings = $stmt->fetch()['count'];
    
    // Total customers
    $stmt = $conn->query("SELECT COUNT(*) as count FROM customers");
    $totalCustomers = $stmt->fetch()['count'];
    
    // Monthly revenue (COMPLETED only)
    $stmt = $conn->query("SELECT COALESCE(SUM(s.price), 0) as revenue FROM bookings b JOIN services s ON b.service_id = s.id WHERE MONTH(b.booking_date) = MONTH(CURDATE()) AND YEAR(b.booking_date) = YEAR(CURDATE()) AND b.status = 'completed'");
    $monthlyRevenue = $stmt->fetch()['revenue'];
    
    // Pending bookings
    $stmt = $conn->query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    $pendingBookings = $stmt->fetch()['count'];
    
    // Today's schedule - ONLY CONFIRMED AND COMPLETED (This is what shows on dashboard!)
    $stmt = $conn->query("
        SELECT 
            TIME_FORMAT(b.booking_time, '%h:%i %p') as booking_time, 
            c.name as customer_name, 
            s.name as service_name, 
            st.name as staff_name, 
            b.status 
        FROM bookings b 
        JOIN customers c ON b.customer_id = c.id 
        JOIN services s ON b.service_id = s.id 
        JOIN staff st ON b.staff_id = st.id 
        WHERE b.booking_date = CURDATE() 
        AND (b.status = 'confirmed' OR b.status = 'completed')
        ORDER BY b.booking_time ASC
    ");
    $todaySchedule = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Recent activity
    $stmt = $conn->query("
        SELECT 
            'calendar-check' as icon, 
            CONCAT('New booking: ', c.name, ' - ', s.name) as message, 
            DATE_FORMAT(b.created_at, '%b %d, %Y %h:%i %p') as time 
        FROM bookings b 
        JOIN customers c ON b.customer_id = c.id 
        JOIN services s ON b.service_id = s.id 
        ORDER BY b.created_at DESC 
        LIMIT 5
    ");
    $recentActivity = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $response = [
        'todayBookings' => $todayBookings,
        'totalCustomers' => $totalCustomers,
        'monthlyRevenue' => number_format($monthlyRevenue, 2),
        'pendingBookings' => $pendingBookings,
        'todaySchedule' => $todaySchedule,
        'recentActivity' => $recentActivity
    ];
    
    echo json_encode($response);
    
} catch(Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>