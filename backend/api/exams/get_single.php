<?php
// /backend/api/exams/get_single.php - Get single exam by ID
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once '../../includes/config.php';

// Check admin authentication
requireAdminAuth();

// Get exam ID from URL
$exam_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($exam_id <= 0) {
    jsonResponse(false, 'ID d\'examen invalide');
}

try {
    $conn = getDBConnection();
    
    // Fetch exam details
    $stmt = $conn->prepare("SELECT * FROM exams WHERE id = ?");
    $stmt->bind_param("i", $exam_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Examen non trouvé');
    }
    
    $exam = $result->fetch_assoc();
    
    // Convert file paths to URLs
    if (!empty($exam['exam_pdf_path'])) {
        $exam['exam_pdf_url'] = '/' . $exam['exam_pdf_path'];
    }
    if (!empty($exam['correction_pdf_path'])) {
        $exam['correction_pdf_url'] = '/' . $exam['correction_pdf_path'];
    }
    
    $stmt->close();
    $conn->close();
    
    jsonResponse(true, 'Examen chargé avec succès', [
        'exam' => $exam
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Erreur: ' . $e->getMessage());
}
?>