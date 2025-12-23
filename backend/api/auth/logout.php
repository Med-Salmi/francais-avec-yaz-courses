<?php
header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] ?? '*');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Allow preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

// Destroy all session data
$_SESSION = [];
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Déconnecté avec succès'
]);
?>