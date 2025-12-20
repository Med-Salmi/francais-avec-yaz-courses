<?php
// backend/api/auth/check.php
header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] ?? '*');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Allow preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'username' => $_SESSION['admin_username'] ?? 'Admin'
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'authenticated' => false,
        'message' => 'Not authenticated'
    ]);
}
?>