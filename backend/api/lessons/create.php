<?php
// backend/api/lessons/create.php - Create new lesson
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
$required_fields = ['title', 'category_id', 'content'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        jsonResponse(false, "Le champ '$field' est obligatoire");
    }
}

// Sanitize inputs
$category_id = intval($input['category_id']);
$title = sanitizeInput($input['title']);
$content = sanitizeInput($input['content']);
$video_url = isset($input['video_url']) ? sanitizeInput($input['video_url']) : '';

// Additional validation
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
    
    // Check if category exists
    $stmt = $conn->prepare("SELECT id FROM categories WHERE id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Catégorie non trouvée');
    }
    
    // Insert the lesson
    $stmt = $conn->prepare("INSERT INTO lecons (category_id, title, content, video_url) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $category_id, $title, $content, $video_url);
    
    if ($stmt->execute()) {
        $lesson_id = $conn->insert_id;
        
        $stmt->close();
        $conn->close();
        
        jsonResponse(true, 'Leçon ajoutée avec succès', [
            'lesson_id' => $lesson_id,
            'title' => $title,
            'category_id' => $category_id
        ]);
    } else {
        throw new Exception($conn->error);
    }
    
} catch (Exception $e) {
    jsonResponse(false, 'Erreur de base de données: ' . $e->getMessage());
}
?>