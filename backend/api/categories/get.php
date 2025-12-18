<?php
// backend/api/categories/get.php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include the config file (note the path - we're 2 levels deep)
require_once '../../includes/config.php';

// Get the level from query parameter
$level_slug = isset($_GET['level']) ? $_GET['level'] : 'tronc-commun';

// Validate level slug
if (!in_array($level_slug, ['tronc-commun', '1ere-annee-bac'])) {
    jsonResponse(false, 'Invalid level specified');
}

try {
    $conn = getDBConnection();
    
    // First, get the level ID from the slug
    $stmt = $conn->prepare("SELECT id FROM niveaux WHERE slug = ?");
    $stmt->bind_param("s", $level_slug);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Level not found');
    }
    
    $level = $result->fetch_assoc();
    $level_id = $level['id'];
    
    // Now get categories for this level
    $stmt = $conn->prepare("
        SELECT id, slug, name, description, icon_class, color_class 
        FROM categories 
        WHERE level_id = ? 
        ORDER BY id
    ");
    $stmt->bind_param("i", $level_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    // Return success with categories
    jsonResponse(true, 'Categories loaded successfully', [
        'categories' => $categories,
        'level_slug' => $level_slug,
        'level_id' => $level_id
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>