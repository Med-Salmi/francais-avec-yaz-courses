<?php
// backend/api/lessons/get_single.php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include the config file
require_once '../../includes/config.php';

// Get lesson ID from query parameter
$lesson_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($lesson_id <= 0) {
    jsonResponse(false, 'Invalid lesson ID');
}

try {
    $conn = getDBConnection();
    
    // Get lesson details
    $stmt = $conn->prepare("
        SELECT l.*, c.name as category_name 
        FROM lecons l 
        JOIN categories c ON l.category_id = c.id 
        WHERE l.id = ?
    ");
    $stmt->bind_param("i", $lesson_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Lesson not found');
    }
    
    $lesson = $result->fetch_assoc();
    
    $stmt->close();
    $conn->close();
    
    jsonResponse(true, 'Lesson loaded successfully', [
        'lesson' => $lesson
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>