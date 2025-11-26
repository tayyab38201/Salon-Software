<?php
error_reporting(0);
require_once 'config.php';

try {
    $conn = getConnection();
    
    // Get recent COMPLETED bookings (last 10)
    // Using booking_date instead of updated_at
    $stmt = $conn->query("
        SELECT 
            CONCAT(SUBSTRING(c.name, 1, LOCATE(' ', c.name)), 
                   IF(LENGTH(c.name) - LENGTH(REPLACE(c.name, ' ', '')) > 0, 
                      CONCAT(SUBSTRING(c.name, LOCATE(' ', c.name) + 1, 1), '.'), 
                      '')) as customer_name,
            s.name as service_name,
            st.name as staff_name,
            CASE 
                WHEN TIMESTAMPDIFF(MINUTE, b.created_at, NOW()) < 60 
                    THEN CONCAT(TIMESTAMPDIFF(MINUTE, b.created_at, NOW()), ' minutes ago')
                WHEN TIMESTAMPDIFF(HOUR, b.created_at, NOW()) < 24 
                    THEN CONCAT(TIMESTAMPDIFF(HOUR, b.created_at, NOW()), ' hours ago')
                WHEN TIMESTAMPDIFF(DAY, b.created_at, NOW()) < 7 
                    THEN CONCAT(TIMESTAMPDIFF(DAY, b.created_at, NOW()), ' days ago')
                ELSE DATE_FORMAT(b.created_at, '%b %d, %Y')
            END as time_ago
        FROM bookings b
        JOIN customers c ON b.customer_id = c.id
        JOIN services s ON b.service_id = s.id
        JOIN staff st ON b.staff_id = st.id
        WHERE b.status = 'completed'
        ORDER BY b.created_at DESC
        LIMIT 10
    ");
    
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($activities);
    
} catch(Exception $e) {
    error_log("Error in public_activity.php: " . $e->getMessage());
    echo json_encode([]);
}
?>