<?php
// Update quiz question
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

// Allow both PUT and POST methods
if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST'])) {
    jsonResponse(false, 'Method not allowed. Use PUT or POST.', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['id', 'lesson_id', 'question', 'option_a', 'option_b', 'correct_answer'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        jsonResponse(false, "Le champ '$field' est obligatoire");
    }
}

// Sanitize inputs
$question_id = intval($input['id']);
$lesson_id = intval($input['lesson_id']);
$question = sanitizeInput($input['question']);
$option_a = sanitizeInput($input['option_a']);
$option_b = sanitizeInput($input['option_b']);
$option_c = isset($input['option_c']) ? sanitizeInput($input['option_c']) : '';
$option_d = isset($input['option_d']) ? sanitizeInput($input['option_d']) : '';
$correct_answer = sanitizeInput($input['correct_answer']);
$explanation = isset($input['explanation']) ? sanitizeInput($input['explanation']) : '';

// Additional validation
if ($question_id <= 0) {
    jsonResponse(false, 'ID de question invalide');
}

if ($lesson_id <= 0) {
    jsonResponse(false, 'ID de leçon invalide');
}

if (strlen($question) < 5) {
    jsonResponse(false, 'La question doit contenir au moins 5 caractères');
}

if (strlen($option_a) < 1) {
    jsonResponse(false, "L'option A est obligatoire");
}

if (strlen($option_b) < 1) {
    jsonResponse(false, "L'option B est obligatoire");
}

if (!in_array($correct_answer, ['a', 'b', 'c', 'd'])) {
    jsonResponse(false, "La réponse correcte doit être a, b, c ou d");
}

// Validate that if correct_answer is c or d, the option must not be empty
if (($correct_answer === 'c' && empty($option_c)) || ($correct_answer === 'd' && empty($option_d))) {
    jsonResponse(false, "La réponse correcte sélectionnée nécessite que l'option correspondante soit remplie");
}

try {
    $conn = getDBConnection();
    
    // Check if question exists and belongs to the specified lesson
    $stmt = $conn->prepare("SELECT id FROM quiz_questions WHERE id = ? AND lesson_id = ?");
    $stmt->bind_param("ii", $question_id, $lesson_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Question non trouvée ou n\'appartient pas à cette leçon');
    }
    
    // Update the quiz question
    $stmt = $conn->prepare("UPDATE quiz_questions SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, explanation = ? WHERE id = ? AND lesson_id = ?");
    $stmt->bind_param("sssssssii", $question, $option_a, $option_b, $option_c, $option_d, $correct_answer, $explanation, $question_id, $lesson_id);
    
    if ($stmt->execute()) {
        $affected_rows = $stmt->affected_rows;
        $stmt->close();
        $conn->close();
        
        jsonResponse(true, 'Question de quiz modifiée avec succès', [
            'affected_rows' => $affected_rows,
            'question_id' => $question_id,
            'lesson_id' => $lesson_id
        ]);
    } else {
        throw new Exception($conn->error);
    }
    
} catch (Exception $e) {
    jsonResponse(false, 'Erreur de base de données: ' . $e->getMessage());
}
?>