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

// Start session for authentication
session_start();

// Include configs
require_once '../../includes/config.php';
require_once 'config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

// Validate input
if (empty($username) || empty($password)) {
    jsonResponse(false, 'Nom d\'utilisateur et mot de passe requis');
}

// Check login attempts (simple rate limiting)
if (!checkLoginAttempts()) {
    jsonResponse(false, 'Trop de tentatives de connexion. Veuillez réessayer plus tard.');
}

// Verify credentials
if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
    // Successful login
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_username'] = $username;
    $_SESSION['login_time'] = time();
    
    // Reset login attempts
    $_SESSION['login_attempts'] = 0;
    $_SESSION['last_attempt_time'] = null;
    
    jsonResponse(true, 'Connexion réussie!', [
        'redirect' => '/?page=dashboard'
    ]);
} else {
    // Failed login
    recordFailedAttempt();
    jsonResponse(false, 'Nom d\'utilisateur ou mot de passe incorrect.');
}

// Helper function to check login attempts
function checkLoginAttempts() {
    if (!isset($_SESSION['login_attempts'])) {
        $_SESSION['login_attempts'] = 0;
        $_SESSION['last_attempt_time'] = null;
    }
    
    $currentTime = time();
    
    // Reset attempts if window has passed
    if ($_SESSION['last_attempt_time'] && 
        ($currentTime - $_SESSION['last_attempt_time']) > LOGIN_ATTEMPT_WINDOW) {
        $_SESSION['login_attempts'] = 0;
        $_SESSION['last_attempt_time'] = null;
    }
    
    return $_SESSION['login_attempts'] < MAX_LOGIN_ATTEMPTS;
}

// Helper function to record failed attempt
function recordFailedAttempt() {
    if (!isset($_SESSION['login_attempts'])) {
        $_SESSION['login_attempts'] = 0;
    }
    
    $_SESSION['login_attempts']++;
    $_SESSION['last_attempt_time'] = time();
}
?>