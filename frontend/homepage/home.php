<?php
// Include header
include __DIR__ . '/../../frontend/header/header.php';
?>

<?php
// Home page components
$projectRoot = dirname(dirname(__DIR__));
include $projectRoot . '/frontend/homepage/hero/hero.php';
include $projectRoot . '/frontend/homepage/features/features.php';
include $projectRoot . '/frontend/homepage/about/about.php';
?>

<?php
// Include footer
include __DIR__ . '/../../frontend/footer/footer.php';
?>