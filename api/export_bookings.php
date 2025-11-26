<?php
require_once 'config.php';

$conn = getConnection();

// Get all bookings
$stmt = $conn->prepare("
    SELECT 
        b.id,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        s.name as service_name,
        s.price,
        st.name as staff_name,
        b.booking_date,
        b.booking_time,
        b.status
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    JOIN services s ON b.service_id = s.id
    JOIN staff st ON b.staff_id = st.id
    ORDER BY b.booking_date DESC
");
$stmt->execute();
$bookings = $stmt->fetchAll();

// Set headers for CSV download
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="bookings_' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');

// Add CSV headers
fputcsv($output, [
    'ID', 
    'Customer Name', 
    'Email', 
    'Phone', 
    'Service', 
    'Price', 
    'Staff', 
    'Date', 
    'Time', 
    'Status'
]);

// Add data rows
foreach ($bookings as $booking) {
    fputcsv($output, [
        $booking['id'],
        $booking['customer_name'],
        $booking['customer_email'],
        $booking['customer_phone'],
        $booking['service_name'],
        $booking['price'],
        $booking['staff_name'],
        $booking['booking_date'],
        $booking['booking_time'],
        $booking['status']
    ]);
}

fclose($output);
?>