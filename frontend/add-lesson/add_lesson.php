<?php
// add_lesson.php - Add Lesson page
// We'll handle backend authentication and form submission separately later
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - Nouvelle Leçon</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Add Lesson CSS -->
    <style>
    <?php include 'add_lesson.css'; ?>
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar (same as dashboard) -->
            <div class="col-md-3 col-lg-2 sidebar">
                <div class="sidebar-header">
                    <h4><i class="fas fa-graduation-cap me-2"></i>Admin Français</h4>
                    <p class="text-muted small mb-0">Bienvenue, Admin</p>
                </div>
                
                <nav class="nav flex-column mt-4">
                    <a class="nav-link" href="/?page=dashboard">
                        <i class="fas fa-tachometer-alt me-2"></i>Tableau de bord
                    </a>
                    <a class="nav-link" href="/?page=manage-lessons">
                        <i class="fas fa-book me-2"></i>Gérer les Cours
                    </a>
                    <a class="nav-link" href="/?page=manage-exams">
                        <i class="fas fa-file-alt me-2"></i>Gérer les Examens
                    </a>
                    
                    <hr class="text-white-50 my-4">
                    
                    <a class="nav-link text-danger" href="/logout">
                        <i class="fas fa-sign-out-alt me-2"></i>Déconnexion
                    </a>
                </nav>
            </div>
            
            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 main-content">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h3"><i class="fas fa-plus-circle me-2"></i>Nouvelle Leçon</h1>
                    <a href="/?page=manage-lessons" class="btn btn-secondary">
                        <i class="fas fa-arrow-left me-2"></i>Retour à la liste
                    </a>
                </div>
                
                <!-- Success Message (will be populated by JS) -->
                <div class="alert alert-success alert-dismissible fade show d-none" role="alert" id="success-message">
                    <i class="fas fa-check-circle me-2"></i>
                    <span id="message-text"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                
                <!-- Error Message (will be populated by JS) -->
                <div class="alert alert-danger alert-dismissible fade show d-none" role="alert" id="error-message">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <span id="error-text"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                
                <div class="form-container">
                    <form method="POST" action="" id="addLessonForm">
                        <div class="row">
                            <div class="col-md-8 mb-3">
                                <label for="title" class="form-label">
                                    <i class="fas fa-heading me-2"></i>Titre de la leçon <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" id="title" name="title" 
                                       placeholder="Ex: Les Articles Définis et Indéfinis" required>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label for="category_id" class="form-label">
                                    <i class="fas fa-folder me-2"></i>Catégorie <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="category_id" name="category_id" required>
                                    <option value="">Sélectionnez une catégorie</option>
                                    <optgroup label="Tronc Commun">
                                        <option value="1">Lecture</option>
                                        <option value="2">Langue</option>
                                        <option value="3">Production écrite</option>
                                        <option value="4">Production orale</option>
                                        <option value="5">Travaux encadrés</option>
                                        <option value="6">Résumés</option>
                                    </optgroup>
                                    <optgroup label="1ère Année Bac">
                                        <option value="7">Étude de texte</option>
                                        <option value="8">Langue</option>
                                        <option value="9">Production écrite</option>
                                        <option value="10">Production orale</option>
                                        <option value="11">Travaux encadrés</option>
                                        <option value="12">Résumés</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="content" class="form-label">
                                <i class="fas fa-align-left me-2"></i>Contenu de la leçon <span class="text-danger">*</span>
                            </label>
                            <textarea class="form-control" id="content" name="content" rows="8" 
                                      placeholder="Écrivez le contenu de la leçon ici..." required></textarea>
                            <div class="form-text">
                                Utilisez des sauts de ligne pour les paragraphes. Le texte sera affiché tel quel.
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label for="video_url" class="form-label">
                                <i class="fas fa-video me-2"></i>URL de la vidéo (optionnel)
                            </label>
                            <input type="url" class="form-control" id="video_url" name="video_url" 
                                   placeholder="Ex: https://www.youtube.com/embed/video_id">
                            <div class="form-text">
                                URL d'intégration YouTube (format embed) ou autre service de vidéo.
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between">
                            <button type="reset" class="btn btn-secondary" id="reset-btn">
                                <i class="fas fa-redo me-2"></i>Effacer
                            </button>
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-save me-2"></i>Enregistrer la leçon
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="alert alert-info mt-4">
                    <h5><i class="fas fa-lightbulb me-2"></i>Conseils pour les leçons</h5>
                    <ul class="mb-0">
                        <li>Utilisez des titres clairs et descriptifs</li>
                        <li>Structurez le contenu avec des paragraphes</li>
                        <li>Pour les vidéos YouTube, utilisez l'URL d'intégration (embed)</li>
                        <li>Après l'ajout, vous pourrez créer un quiz pour cette leçon</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Add Lesson JavaScript -->
    <script>
    <?php include 'add_lesson.js'; ?>
    </script>
</body>
</html>