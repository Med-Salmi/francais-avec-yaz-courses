<?php
// backend/api/exams/list.php - Get all exams for admin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../includes/config.php';

// Check admin authentication
requireAdminAuth();

try {
    $conn = getDBConnection();
    
    // Get all exams for 1ere-annee-bac (admin view)
    $sql = "SELECT * FROM exams WHERE level_slug = '1ere-annee-bac' ORDER BY exam_year DESC, created_at DESC";
    $result = $conn->query($sql);
    
    $exams = [];
    while ($row = $result->fetch_assoc()) {
        $exams[] = $row;
    }
    
    // Get unique years for info
    $yearStmt = $conn->prepare("SELECT DISTINCT exam_year FROM exams WHERE level_slug = '1ere-annee-bac' ORDER BY exam_year DESC");
    $yearStmt->execute();
    $yearResult = $yearStmt->get_result();
    
    $years = [];
    while ($row = $yearResult->fetch_assoc()) {
        $years[] = $row['exam_year'];
    }
    
    $conn->close();
    
    jsonResponse(true, 'Exams loaded successfully', [
        'exams' => $exams,
        'years' => $years,
        'count' => count($exams)
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>