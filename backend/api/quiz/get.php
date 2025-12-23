<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit();
}

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Include the config file
require_once '../../includes/config.php';

// Get lesson ID from query parameter
$lesson_id = isset($_GET['lesson_id']) ? intval($_GET['lesson_id']) : 0;

if ($lesson_id <= 0) {
    jsonResponse(false, 'Invalid lesson ID');
}

try {
    $conn = getDBConnection();
    
    // Get quiz questions for this lesson
    $stmt = $conn->prepare("
        SELECT id, question, option_a, option_b, option_c, option_d, 
               correct_answer, explanation 
        FROM quiz_questions 
        WHERE lesson_id = ? 
        ORDER BY id
    ");
    $stmt->bind_param("i", $lesson_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    jsonResponse(true, 'Quiz questions loaded successfully', [
        'questions' => $questions,
        'count' => count($questions)
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>