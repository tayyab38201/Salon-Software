<?php
error_reporting(0);
require_once 'config.php';

try {
    $conn = getConnection();
    
    $date = $_GET['date'] ?? date('Y-m-d');
    $serviceId = $_GET['service_id'] ?? 0;
    $staffId = $_GET['staff_id'] ?? 0;
    
    // Get service duration
    $stmt = $conn->prepare("SELECT duration FROM services WHERE id = ?");
    $stmt->execute([$serviceId]);
    $service = $stmt->fetch();
    $duration = $service['duration'] ?? 30;
    
    // Get booked slots
    $stmt = $conn->prepare("SELECT booking_time, s.duration FROM bookings b JOIN services s ON b.service_id = s.id WHERE booking_date = ? AND staff_id = ? AND status != 'cancelled'");
    $stmt->execute([$date, $staffId]);
    $bookedSlots = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Generate time slots (9 AM to 7 PM, 30-min intervals)
    $slots = [];
    $startTime = strtotime('09:00');
    $endTime = strtotime('19:00');
    $interval = 30 * 60;
    
    for ($time = $startTime; $time < $endTime; $time += $interval) {
        $available = true;
        
        foreach ($bookedSlots as $booked) {
            $bookedStart = strtotime($booked['booking_time']);
            $bookedEnd = $bookedStart + ($booked['duration'] * 60);
            $slotStart = $time;
            $slotEnd = $time + ($duration * 60);
            
            if (($slotStart >= $bookedStart && $slotStart < $bookedEnd) ||
                ($slotEnd > $bookedStart && $slotEnd <= $bookedEnd) ||
                ($slotStart <= $bookedStart && $slotEnd >= $bookedEnd)) {
                $available = false;
                break;
            }
        }
        
        $slots[] = [
            'time' => date('h:i A', $time),
            'available' => $available
        ];
    }
    
    echo json_encode($slots);
    
} catch(Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>