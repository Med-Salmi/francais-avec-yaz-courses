<?php
// Get ALL categories grouped by level
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../includes/config.php';

// Check admin authentication for this endpoint
requireAdminAuth();

try {
    $conn = getDBConnection();
    
    // Get all categories with their level information
    // ORDER BY category ID (assuming earlier created categories have lower IDs)
    $sql = "SELECT c.id, c.name, c.slug, n.name as level_name, n.slug as level_slug 
            FROM categories c 
            JOIN niveaux n ON c.level_id = n.id 
            ORDER BY n.id, c.id";  // First by level, then by category ID
    
    $result = $conn->query($sql);
    
    // Group categories by level
    $categoriesByLevel = [];
    while ($row = $result->fetch_assoc()) {
        $level_slug = $row['level_slug'];
        
        if (!isset($categoriesByLevel[$level_slug])) {
            $categoriesByLevel[$level_slug] = [
                'level_slug' => $level_slug,
                'level_name' => $row['level_name'],
                'categories' => []
            ];
        }
        
        $categoriesByLevel[$level_slug]['categories'][] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'slug' => $row['slug']
        ];
    }
    
    // Convert associative array to indexed array
    $result_array = array_values($categoriesByLevel);
    
    $conn->close();
    
    jsonResponse(true, 'All categories loaded successfully', $result_array);
    
} catch (Exception $e) {
    jsonResponse(false, 'Database error: ' . $e->getMessage());
}
?>