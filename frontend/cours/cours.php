<?php
// Include header
include __DIR__ . '/../../frontend/header/header.php';
?>

<?php
// Cours page components
$projectRoot = dirname(dirname(__DIR__));
include $projectRoot . '/frontend/cours/level-selector/level-selector.php';
include $projectRoot . '/frontend/cours/categories/categories.php';
?>

<?php
// Include footer
include __DIR__ . '/../../frontend/footer/footer.php';
?>