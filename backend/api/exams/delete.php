<?php
// backend/api/exams/delete.php - Delete exam
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once '../../includes/config.php';

// Check admin authentication
requireAdminAuth();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['id']) || empty($input['id'])) {
    jsonResponse(false, 'ID d\'examen obligatoire');
}

// Sanitize inputs
$exam_id = intval($input['id']);

if ($exam_id <= 0) {
    jsonResponse(false, 'ID d\'examen invalide');
}

try {
    $conn = getDBConnection();
    
    // First get exam info to delete files
    $stmt = $conn->prepare("SELECT exam_pdf_path, correction_pdf_path FROM exams WHERE id = ?");
    $stmt->bind_param("i", $exam_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Examen non trouvé');
    }
    
    $exam = $result->fetch_assoc();
    
    // Delete the exam
    $stmt = $conn->prepare("DELETE FROM exams WHERE id = ?");
    $stmt->bind_param("i", $exam_id);
    
    if ($stmt->execute()) {
        $affected_rows = $stmt->affected_rows;
        
        // Delete associated PDF files if they exist
        if (!empty($exam['exam_pdf_path']) && file_exists($exam['exam_pdf_path'])) {
            unlink($exam['exam_pdf_path']);
        }
        
        if (!empty($exam['correction_pdf_path']) && file_exists($exam['correction_pdf_path'])) {
            unlink($exam['correction_pdf_path']);
        }
        
        $stmt->close();
        $conn->close();
        
        if ($affected_rows > 0) {
            jsonResponse(true, 'Examen supprimé avec succès', [
                'affected_rows' => $affected_rows,
                'exam_id' => $exam_id
            ]);
        } else {
            jsonResponse(false, 'Examen non trouvé');
        }
    } else {
        throw new Exception($conn->error);
    }
    
} catch (Exception $e) {
    jsonResponse(false, 'Erreur de base de données: ' . $e->getMessage());
}
?>