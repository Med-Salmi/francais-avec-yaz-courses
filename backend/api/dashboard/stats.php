<?php
header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] ?? '*');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Allow preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start session for authentication
session_start();

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Non autorisé. Veuillez vous connecter.'
    ]);
    exit;
}

// Include config
require_once '../../includes/config.php';

try {
    $conn = getDBConnection();
    
    // 1. Count Tronc Commun courses
    $stmt = $conn->prepare("
        SELECT COUNT(*) as total 
        FROM lecons l 
        JOIN categories c ON l.category_id = c.id 
        JOIN niveaux n ON c.level_id = n.id 
        WHERE n.slug = 'tronc-commun'
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $troncCommun = $result->fetch_assoc()['total'];
    
    // 2. Count 1ère Année Bac courses
    $stmt = $conn->prepare("
        SELECT COUNT(*) as total 
        FROM lecons l 
        JOIN categories c ON l.category_id = c.id 
        JOIN niveaux n ON c.level_id = n.id 
        WHERE n.slug = '1ere-annee-bac'
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $bac = $result->fetch_assoc()['total'];
    
    // 3. Count total exams (only 1ère année bac)
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM exams WHERE level_slug = '1ere-annee-bac'");
    $stmt->execute();
    $result = $stmt->get_result();
    $exams = $result->fetch_assoc()['total'];
    
    // 4. Count total categories
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM categories");
    $stmt->execute();
    $result = $stmt->get_result();
    $categories = $result->fetch_assoc()['total'];
    
    $conn->close();
    
    // Return statistics
    jsonResponse(true, 'Statistiques chargées', [
        'stats' => [
            'tronc_commun' => (int)$troncCommun,
            'bac' => (int)$bac,
            'exams' => (int)$exams,
            'categories' => (int)$categories
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Erreur de base de données: ' . $e->getMessage());
}
?>