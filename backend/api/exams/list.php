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
    
    // Get all exams for 1ere-annee-bac (admin view) - UPDATED: select specific columns
    $sql = "SELECT 
                id, 
                title, 
                description, 
                exam_pdf_path, 
                correction_langue_path, 
                correction_production_path,
                level_slug, 
                exam_year, 
                created_at 
            FROM exams 
            WHERE level_slug = '1ere-annee-bac' 
            ORDER BY exam_year DESC, created_at DESC";
    $result = $conn->query($sql);
    
    $exams = [];
    while ($row = $result->fetch_assoc()) {
        // Add URLs for display
        if (!empty($row['exam_pdf_path'])) {
            $row['exam_pdf_url'] = '/' . ltrim($row['exam_pdf_path'], '/');
        }
        if (!empty($row['correction_langue_path'])) {
            $row['correction_langue_url'] = '/' . ltrim($row['correction_langue_path'], '/');
        }
        if (!empty($row['correction_production_path'])) {
            $row['correction_production_url'] = '/' . ltrim($row['correction_production_path'], '/');
        }
        
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