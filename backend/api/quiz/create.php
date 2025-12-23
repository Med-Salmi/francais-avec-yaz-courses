<?php
// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit();
}

// Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Start session for auth
session_start();
require_once __DIR__ . '/../../includes/config.php';

// Only handle POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed. Use POST.', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    jsonResponse(false, 'Authentication required. Please login.', null, 401);
}

// Validate required fields
$required_fields = ['lesson_id', 'question', 'option_a', 'option_b', 'correct_answer'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        jsonResponse(false, "Le champ '$field' est obligatoire");
    }
}

// Simple validation
if (!in_array($input['correct_answer'], ['a', 'b', 'c', 'd'])) {
    jsonResponse(false, "La réponse correcte doit être a, b, c ou d");
}

// Try to insert
try {
    $conn = getDBConnection();
    
    // Prepare statement
    $stmt = $conn->prepare("INSERT INTO quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    // Bind parameters
    $lesson_id = intval($input['lesson_id']);
    $question = $input['question'];
    $option_a = $input['option_a'];
    $option_b = $input['option_b'];
    $option_c = $input['option_c'] ?? '';
    $option_d = $input['option_d'] ?? '';
    $correct_answer = $input['correct_answer'];
    $explanation = $input['explanation'] ?? '';
    
    $stmt->bind_param("isssssss", $lesson_id, $question, $option_a, $option_b, $option_c, $option_d, $correct_answer, $explanation);
    
    if ($stmt->execute()) {
        $question_id = $conn->insert_id;
        $stmt->close();
        $conn->close();
        
        jsonResponse(true, 'Question de quiz ajoutée avec succès', [
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