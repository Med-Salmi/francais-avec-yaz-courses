<?php
// Include header
include __DIR__ . '/../../frontend/header/header.php';
?>

<?php
// Cours page components
$projectRoot = dirname(dirname(__DIR__));

// Level selector
include $projectRoot . '/frontend/cours/level-selector/level-selector.php';

// Categories
include $projectRoot . '/frontend/cours/categories/categories.php';

// Lessons List Modal
include $projectRoot . '/frontend/cours/modals/lessons-list/lessons-list.php';

// Lesson Item Modal
include $projectRoot . '/frontend/cours/modals/lesson-item/lesson-item.php';
?>

<?php
// Include footer
include __DIR__ . '/../../frontend/footer/footer.php';
?>