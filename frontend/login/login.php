<?php
// login.php - Complete login page
// Note: We'll handle backend logic separately later
$error = ""; // Will be set by backend
?>

<!-- Login page CSS -->
<style>
<?php include 'login.css'; ?>
</style>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
            <div class="login-card">
                <div class="login-header">
                    <h1><i class="fas fa-graduation-cap me-2"></i>Plateforme Français</h1>
                    <p class="mb-0">Espace Administrateur</p>
                </div>
                
                <div class="login-body">
                    <h3 class="text-center mb-4">Connexion</h3>
                    
                    <!-- Error/Success Alert (initially hidden) -->
                    <div class="alert alert-danger alert-dismissible fade show d-none" role="alert" id="login-error">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <span id="error-message"></span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    
                    <form method="POST" action="" id="loginForm">
                        <div class="mb-3">
                            <label for="username" class="form-label">
                                <i class="fas fa-user me-2"></i>Nom d'utilisateur
                            </label>
                            <input type="text" class="form-control form-control-lg" 
                                   id="username" name="username" 
                                   placeholder="Entrez votre nom d'utilisateur" required>
                        </div>
                        
                        <div class="mb-4">
                            <label for="password" class="form-label">
                                <i class="fas fa-lock me-2"></i>Mot de passe
                            </label>
                            <input type="password" class="form-control form-control-lg" 
                                   id="password" name="password" 
                                   placeholder="Entrez votre mot de passe" required>
                        </div>
                        
                        <button type="submit" class="btn btn-login btn-lg">
                            <i class="fas fa-sign-in-alt me-2"></i>Se connecter
                        </button>
                    </form>
                    
                </div>
            </div>
            
            <div class="text-center mt-4">
                <a href="/" class="text-white back-home-link">
                    <i class="fas fa-arrow-left me-2"></i>Retour à l'accueil
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Login page JavaScript -->
<script>
<?php include 'login.js'; ?>
</script>