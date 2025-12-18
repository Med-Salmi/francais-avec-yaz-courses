<?php
// backend/includes/config.php
// Based on old includes/config.php

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'french_teacher_db');
define('DB_USER', 'root');
define('DB_PASS', 'YourPassword123!'); // Your actual MySQL password

// Upload directories
define('UPLOAD_BASE_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_EXAMS_DIR', UPLOAD_BASE_DIR . 'exams/');
define('UPLOAD_CORRECTIONS_DIR', UPLOAD_BASE_DIR . 'corrections/');

// File upload limits
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_FILE_TYPES', ['application/pdf']);

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set timezone
date_default_timezone_set('Africa/Casablanca');

// Database connection function
function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        // Set charset to UTF-8
        $conn->set_charset("utf8mb4");
        
        return $conn;
        
    } catch (Exception $e) {
        // Log error (in production, don't display to users)
        error_log("Database error: " . $e->getMessage());
        
        // Return a user-friendly error
        die("Database connection error. Please try again later.");
    }
}

// JSON response helper function
function jsonResponse($success, $message = '', $data = null, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json');
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// Check if user is logged in (for admin API endpoints)
function requireAdminAuth() {
    session_start();
    
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        jsonResponse(false, 'Authentication required. Please login.', null, 401);
    }
}

// Sanitize input function
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Create upload directories if they don't exist
function ensureUploadDirectories() {
    $directories = [UPLOAD_EXAMS_DIR, UPLOAD_CORRECTIONS_DIR];
    
    foreach ($directories as $dir) {
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
    }
}

// Call this to ensure directories exist
ensureUploadDirectories();
?>