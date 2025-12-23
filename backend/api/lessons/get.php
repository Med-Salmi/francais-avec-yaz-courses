<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include the config file 
require_once '../../includes/config.php';

// Get parameters
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;
$level_slug = isset($_GET['level']) ? $_GET['level'] : 'tronc-commun';

// Validate parameters
if ($category_id <= 0) {
    jsonResponse(false, 'Invalid category ID');
}

if (!in_array($level_slug, ['tronc-commun', '1ere-annee-bac'])) {
    jsonResponse(false, 'Invalid level specified');
}

try {
    $conn = getDBConnection();
    
    // Verify the category belongs to the specified level
    $stmt = $conn->prepare("
        SELECT c.id 
        FROM categories c 
        JOIN niveaux n ON c.level_id = n.id 
        WHERE c.id = ? AND n.slug = ?
    ");
    $stmt->bind_param("is", $category_id, $level_slug);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Category not found for this level');
    }
    
    // Get lessons for this category
    $stmt = $conn->prepare("
        SELECT id, title, video_url, created_at 
        FROM lecons 
        WHERE category_id = ? 
        ORDER BY created_at DESC
    ");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $lessons = [];
    while ($row = $result->fetch_assoc()) {
        // Format the date
        $row['created_at'] = date('d/m/Y', strtotime($row['created_at']));
        $lessons[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    jsonResponse(true, 'Lessons loaded successfully', [
        'lessons' => $lessons,
        'count' => count($lessons)
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>