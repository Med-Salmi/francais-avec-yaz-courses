<?php
// Include header
include __DIR__ . '/../../frontend/header/header.php';
?>

<?php
// Examens page components
$projectRoot = dirname(dirname(__DIR__));
include $projectRoot . '/frontend/examens/page-header/page-header.php';
include $projectRoot . '/frontend/examens/filters/filters.php';
include $projectRoot . '/frontend/examens/exams-grid/exams-grid.php';
?>

<?php
// Include footer
include __DIR__ . '/../../frontend/footer/footer.php';
?>