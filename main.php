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
    case 'dashboard':
        include 'frontend/dashboard/dashboard.php';
        break;
    case 'manage-lessons':
        include 'frontend/manage-lessons/manage_lessons.php';
        break;
    case 'manage-exams':
        include 'frontend/manage-exams/manage_exams.php'; 
        break;
    case 'add-lesson':
        include 'frontend/add-lesson/add_lesson.php';
        break;
    case 'edit-lesson':
        include 'frontend/edit-lesson/edit_lesson.php';
        break;
    case 'add-exam':
        include 'frontend/add-exam/add_exam.php';
        break;
    case 'edit-exam':
        include 'frontend/edit-exam/edit_exam.php';
        break;
    default:
        include 'frontend/homepage/home.php';
        break;
}