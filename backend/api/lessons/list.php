<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include the config file 
require_once '../../includes/config.php';

// Check admin authentication for this endpoint
requireAdminAuth();

try {
    $conn = getDBConnection();
    
    // Fetch lessons with category names 
    $sql = "SELECT l.*, c.name as category_name 
            FROM lecons l 
            JOIN categories c ON l.category_id = c.id 
            ORDER BY l.created_at DESC";
    
    $result = $conn->query($sql);
    
    $lessons = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Format the date for display (keep Y-m-d for JavaScript parsing)
            $row['created_at'] = date('Y-m-d', strtotime($row['created_at']));
            $lessons[] = $row;
        }
    }
    
    $conn->close();
    
    // Return JSON response
    jsonResponse(true, 'Lessons loaded successfully', [
        'lessons' => $lessons,
        'count' => count($lessons)
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>