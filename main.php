<?php
// Get current page from URL or query parameter
$currentPage = 'home'; // default

// First check for page parameter from query string
if (isset($_GET['page']) && !empty($_GET['page'])) {
    $currentPage = $_GET['page'];
} 
// Then check URL path
else {
    $requestUri = $_SERVER['REQUEST_URI'];
    
    if (strpos($requestUri, 'cours') !== false) {
        $currentPage = 'cours';
    } elseif (strpos($requestUri, 'examens') !== false) {
        $currentPage = 'examens';
    } elseif (strpos($requestUri, 'login') !== false) {
        $currentPage = 'login';
    } elseif (strpos($requestUri, 'admin') !== false) {
        $currentPage = 'admin';
    }
}

// Include page-specific content
switch ($currentPage) {
    case 'home':
        include 'frontend/homepage/home.php';
        break;
    case 'cours':
        include 'frontend/cours/cours.php';
        break;
    case 'examens':
        include 'frontend/examens/examens.php';
        break;
    case 'login':
        include 'frontend/login/login.php';
        break;
    case 'admin':
        include 'admin/index.php';
        break;
    default:
        include 'frontend/homepage/home.php';
        break;
}
