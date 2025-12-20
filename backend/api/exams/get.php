<?php
// backend/api/exams/get.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once '../../includes/config.php';

// Get parameters
$level_slug = isset($_GET['level']) ? $_GET['level'] : '1ere-annee-bac';
$year = isset($_GET['year']) ? intval($_GET['year']) : null;

// Force 1ere-annee-bac since that's all you have
$level_slug = '1ere-annee-bac';

try {
    $conn = getDBConnection();
    
    // Build query
    $query = "SELECT * FROM exams WHERE level_slug = ?";
    $params = [$level_slug];
    $types = "s";
    
    if ($year) {
        $query .= " AND exam_year = ?";
        $params[] = $year;
        $types .= "i";
    }
    
    $query .= " ORDER BY exam_year DESC, created_at DESC";
    
    $stmt = $conn->prepare($query);
    
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $exams = [];
    while ($row = $result->fetch_assoc()) {
        // Ensure PDF paths are complete URLs
        if (!empty($row['exam_pdf_path'])) {
            $row['exam_pdf_url'] = $row['exam_pdf_path']; // Already absolute path
        }
        
        if (!empty($row['correction_pdf_path'])) {
            $row['correction_pdf_url'] = $row['correction_pdf_path']; // Already absolute path
        }
        
        $exams[] = $row;
    }
    
    // Get unique years for filters
    $filterStmt = $conn->prepare("
        SELECT DISTINCT exam_year FROM exams WHERE level_slug = ? ORDER BY exam_year DESC
    ");
    $filterStmt->bind_param("s", $level_slug);
    $filterStmt->execute();
    $yearResult = $filterStmt->get_result();
    
    $years = [];
    while ($row = $yearResult->fetch_assoc()) {
        $years[] = $row['exam_year'];
    }
    
    $stmt->close();
    $conn->close();
    
    jsonResponse(true, 'Exams loaded successfully', [
        'exams' => $exams,
        'filters' => [
            'years' => $years
        ],
        'count' => count($exams)
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>