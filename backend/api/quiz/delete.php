<?php
// backend/api/quiz/delete.php - Delete quiz question

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit();
}

// Regular request headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once '../../includes/config.php';

// Start session for auth
session_start();

// Check admin authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    jsonResponse(false, 'Authentication required. Please login.', null, 401);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed. Use POST.', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['id']) || empty($input['id'])) {
    jsonResponse(false, 'ID de question obligatoire');
}

// Sanitize inputs
$question_id = intval($input['id']);

if ($question_id <= 0) {
    jsonResponse(false, 'ID de question invalide');
}

try {
    $conn = getDBConnection();
    
    // Delete the quiz question
    $stmt = $conn->prepare("DELETE FROM quiz_questions WHERE id = ?");
    $stmt->bind_param("i", $question_id);
    
    if ($stmt->execute()) {
        $affected_rows = $stmt->affected_rows;
        $stmt->close();
        $conn->close();
        
        if ($affected_rows > 0) {
            jsonResponse(true, 'Question de quiz supprimée avec succès', [
                'affected_rows' => $affected_rows,
                'question_id' => $question_id
            ]);
        } else {
            jsonResponse(false, 'Question non trouvée');
        }
    } else {
        throw new Exception($conn->error);
    }
    
} catch (Exception $e) {
    jsonResponse(false, 'Erreur de base de données: ' . $e->getMessage());
}
?>