<?php
// backend/api/lessons/update.php - Update existing lesson
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once '../../includes/config.php';

// Check admin authentication
requireAdminAuth();

// Allow both PUT and POST methods
if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST'])) {
    jsonResponse(false, 'Method not allowed', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['id', 'title', 'category_id', 'content'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        jsonResponse(false, "Le champ '$field' est obligatoire");
    }
}

// Sanitize inputs
$lesson_id = intval($input['id']);
$category_id = intval($input['category_id']);
$title = sanitizeInput($input['title']);
$content = sanitizeInput($input['content']);
$video_url = isset($input['video_url']) ? sanitizeInput($input['video_url']) : '';

// Additional validation
if ($lesson_id <= 0) {
    jsonResponse(false, 'ID de leçon invalide');
}

if ($category_id <= 0) {
    jsonResponse(false, 'Catégorie invalide');
}

if (strlen($title) < 5) {
    jsonResponse(false, 'Le titre doit contenir au moins 5 caractères');
}

if (strlen($content) < 50) {
    jsonResponse(false, 'Le contenu doit contenir au moins 50 caractères');
}

if (!empty($video_url) && !filter_var($video_url, FILTER_VALIDATE_URL)) {
    jsonResponse(false, 'URL de vidéo invalide');
}

try {
    $conn = getDBConnection();
    
    // Check if lesson exists
    $stmt = $conn->prepare("SELECT id FROM lecons WHERE id = ?");
    $stmt->bind_param("i", $lesson_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Leçon non trouvée');
    }
    
    // Check if category exists
    $stmt = $conn->prepare("SELECT id FROM categories WHERE id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Catégorie non trouvée');
    }
    
    // Update the lesson
    $stmt = $conn->prepare("UPDATE lecons SET category_id = ?, title = ?, content = ?, video_url = ?, updated_at = NOW() WHERE id = ?");
    $stmt->bind_param("isssi", $category_id, $title, $content, $video_url, $lesson_id);
    
    if ($stmt->execute()) {
        $affected_rows = $stmt->affected_rows;
        $stmt->close();
        $conn->close();
        
        jsonResponse(true, 'Leçon modifiée avec succès', [
            'affected_rows' => $affected_rows,
            'lesson_id' => $lesson_id,
            'title' => $title
        ]);
    } else {
        throw new Exception($conn->error);
    }
    
} catch (Exception $e) {
    jsonResponse(false, 'Erreur de base de données: ' . $e->getMessage());
}
?>