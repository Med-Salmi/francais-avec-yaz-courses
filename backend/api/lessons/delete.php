<?php
// backend/api/lessons/delete.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Include the config file
require_once '../../includes/config.php';

// Check admin authentication
requireAdminAuth();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$lesson_id = isset($input['id']) ? intval($input['id']) : 0;

if ($lesson_id <= 0) {
    jsonResponse(false, 'Invalid lesson ID');
}

try {
    $conn = getDBConnection();
    
    // Start transaction
    $conn->begin_transaction();
    
    // First, delete associated quiz questions
    $stmt = $conn->prepare("DELETE FROM quiz_questions WHERE lesson_id = ?");
    $stmt->bind_param("i", $lesson_id);
    $stmt->execute();
    $stmt->close();
    
    // Then delete the lesson
    $stmt = $conn->prepare("DELETE FROM lecons WHERE id = ?");
    $stmt->bind_param("i", $lesson_id);
    $stmt->execute();
    
    $affected_rows = $stmt->affected_rows;
    $stmt->close();
    
    // Commit transaction
    $conn->commit();
    $conn->close();
    
    if ($affected_rows > 0) {
        jsonResponse(true, 'Lesson deleted successfully');
    } else {
        jsonResponse(false, 'Lesson not found or already deleted');
    }
    
} catch (Exception $e) {
    // Rollback on error
    if (isset($conn)) {
        $conn->rollback();
    }
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>