<?php
// Update existing lesson
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

// Define allowed HTML tags for lesson content 
define('ALLOWED_HTML_TAGS', '<h1><h2><h3><h4><h5><h6><p><div><span><strong><b><em><i><u><s><strike><sub><sup>');
define('ALLOWED_LIST_TAGS', '<ul><ol><li>');
define('ALLOWED_MEDIA_TAGS', '<a><img><iframe><video><audio><source><track>');
define('ALLOWED_CODE_TAGS', '<code><pre>');
define('ALLOWED_TABLE_TAGS', '<table><tr><td><th><tbody><thead><tfoot><caption>');
define('ALLOWED_OTHER_TAGS', '<br><hr><blockquote>');

// Combine all allowed tags
$ALL_TAGS = ALLOWED_HTML_TAGS . ALLOWED_LIST_TAGS . ALLOWED_MEDIA_TAGS . 
            ALLOWED_CODE_TAGS . ALLOWED_TABLE_TAGS . ALLOWED_OTHER_TAGS;

// Function to safely sanitize HTML content (preserves formatting, prevents XSS) 
function sanitizeLessonContent($content) {
    global $ALL_TAGS;
    
    if (empty($content)) {
        return '';
    }
    
    // 1. Strip all tags except allowed ones
    $content = strip_tags($content, $ALL_TAGS);
    
    // 2. Remove dangerous attributes but keep style attributes for formatting
    $content = preg_replace_callback('/<(\w+)[^>]*>/i', function($matches) {
        $tag = $matches[1];
        $full_match = $matches[0];
        
        // List of safe attributes for each tag type
        $safe_attributes = ['style', 'class', 'id', 'href', 'src', 'alt', 'title', 'target', 'width', 'height', 'frameborder', 'allowfullscreen'];
        
        // Remove all attributes first
        $clean_tag = "<$tag";
        
        // Check for style attribute (for formatting)
        if (preg_match('/style="([^"]*)"/i', $full_match, $style_matches)) {
            $style = $style_matches[1];
            
            // Only allow safe CSS properties
            $allowed_css = [
                'color', 'background-color', 'font-size', 'font-family', 'font-weight',
                'font-style', 'text-align', 'text-decoration', 'line-height',
                'border', 'border-radius', 'padding', 'margin', 'width', 'height',
                'display', 'list-style-type', 'list-style-position'
            ];
            
            // Filter CSS properties
            $style_rules = explode(';', $style);
            $filtered_rules = [];
            
            foreach ($style_rules as $rule) {
                if (empty(trim($rule))) continue;
                
                $parts = explode(':', $rule, 2);
                if (count($parts) !== 2) continue;
                
                $property = strtolower(trim($parts[0]));
                $value = trim($parts[1]);
                
                // Check if property is allowed
                $is_allowed = false;
                foreach ($allowed_css as $allowed) {
                    if (strpos($property, $allowed) === 0) {
                        $is_allowed = true;
                        break;
                    }
                }
                
                if ($is_allowed) {
                    // Basic value sanitization (remove <> characters)
                    $value = preg_replace('/[<>]/', '', $value);
                    $filtered_rules[] = $property . ':' . $value;
                }
            }
            
            if (!empty($filtered_rules)) {
                $clean_tag .= ' style="' . implode(';', $filtered_rules) . '"';
            }
        }
        
        // Check for other safe attributes
        foreach ($safe_attributes as $attr) {
            if ($attr === 'style') continue; // Already handled
            
            if (preg_match('/' . $attr . '="([^"]*)"/i', $full_match, $attr_matches)) {
                $attr_value = $attr_matches[1];
                
                // Special handling for different attributes
                if ($attr === 'href' || $attr === 'src') {
                    // Allow http, https, and relative URLs
                    if (preg_match('/^(https?:\\/\\/|\\/)/i', $attr_value)) {
                        $clean_tag .= ' ' . $attr . '="' . htmlspecialchars($attr_value, ENT_QUOTES, 'UTF-8') . '"';
                    }
                } elseif ($attr === 'target') {
                    // Only allow _blank
                    if ($attr_value === '_blank') {
                        $clean_tag .= ' target="_blank"';
                    }
                } else {
                    // For other attributes, basic sanitization
                    $clean_tag .= ' ' . $attr . '="' . htmlspecialchars($attr_value, ENT_QUOTES, 'UTF-8') . '"';
                }
            }
        }
        
        $clean_tag .= '>';
        return $clean_tag;
    }, $content);
    
    // 3. Remove any remaining event handlers or javascript
    $content = preg_replace('/on\w+\s*=\s*"[^"]*"/i', '', $content);
    $content = preg_replace('/on\w+\s*=\s*\'[^\']*\'/i', '', $content);
    $content = preg_replace('/javascript:/i', '', $content);
    
    // 4. Remove script tags completely (strip_tags should have done this, but just in case)
    $content = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $content);
    
    return trim($content);
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

// Sanitize inputs (UPDATED: content now uses sanitizeLessonContent)
$lesson_id = intval($input['id']);
$category_id = intval($input['category_id']);
$title = sanitizeInput($input['title']);
$content = !empty($input['content']) ? sanitizeLessonContent($input['content']) : ''; // CHANGED: now uses sanitizeLessonContent
$video_url = isset($input['video_url']) ? sanitizeInput($input['video_url']) : '';

// Additional validation (UPDATED for HTML content)
if ($lesson_id <= 0) {
    jsonResponse(false, 'ID de leçon invalide');
}

if ($category_id <= 0) {
    jsonResponse(false, 'Catégorie invalide');
}

if (strlen($title) < 5) {
    jsonResponse(false, 'Le titre doit contenir au moins 5 caractères');
}

// Check content length without HTML tags 
$content_text_only = strip_tags($content);
if (strlen($content_text_only) < 50) {
    jsonResponse(false, 'Le contenu doit contenir au moins 50 caractères de texte (sans les balises HTML)');
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