<?php
// Determine current page for active link highlighting
// First check for page parameter
if (isset($_GET['page']) && !empty($_GET['page'])) {
    $currentPage = $_GET['page'];
} else {
    // Fall back to PHP_SELF
    $currentPage = basename($_SERVER['PHP_SELF']);
    // Clean the currentPage variable for comparison
    $currentPage = str_replace('.php', '', $currentPage);
}
?>

<!-- Header Component CSS -->
<style>
<?php include 'header.css'; ?>
</style>

<!-- Header Component HTML -->
<header class="main-header">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center">
            <a href="index.php" class="brand">
                <i class="fas fa-graduation-cap me-2"></i>Français Avec Yaz
            </a>

            <!-- Hamburger Button (visible on mobile) -->
            <button class="navbar-toggler d-md-none" type="button" id="mobileMenuBtn" aria-label="Ouvrir le menu">
                <i class="fas fa-bars"></i>
            </button>

            <!-- Desktop Navigation Menu -->
            <nav class="d-none d-md-block">
                <ul class="nav">
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'index' || $currentPage == 'home') ? 'active' : ''; ?>" href="index.php">Accueil</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'cours') ? 'active' : ''; ?>" href="index.php?page=cours">Cours</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'examens') ? 'active' : ''; ?>" href="index.php?page=examens">Examens</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($currentPage == 'admin') ? 'active' : ''; ?>" href="index.php?page=login">Admin</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</header>

<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>

<!-- Mobile Menu (hidden by default) -->
<div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-header">
        <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Fermer le menu">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <ul class="mobile-nav">
        <li>
            <a href="index.php" class="mobile-nav-link <?php echo ($currentPage == 'index' || $currentPage == 'home') ? 'active' : ''; ?>">
                <i class="fas fa-home me-2"></i>Accueil
            </a>
        </li>
        <li>
            <a href="index.php?page=cours" class="mobile-nav-link <?php echo ($currentPage == 'cours') ? 'active' : ''; ?>">
                <i class="fas fa-book me-2"></i>Cours
            </a>
        </li>
        <li>
            <a href="index.php?page=examens" class="mobile-nav-link <?php echo ($currentPage == 'examens') ? 'active' : ''; ?>">
                <i class="fas fa-file-alt me-2"></i>Examens
            </a>
        </li>
        <li>
            <a href="index.php?page=login" class="mobile-nav-link <?php echo ($currentPage == 'admin') ? 'active' : ''; ?>">
                <i class="fas fa-user-cog me-2"></i>Admin
            </a>
        </li>
    </ul>
</div>

<!-- Header Component JavaScript -->
<script>
<?php include 'header.js'; ?>
</script>