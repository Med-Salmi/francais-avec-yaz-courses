<?php
// edit_lesson.php - Edit Lesson page
// We'll handle backend authentication and data loading separately later
// For now, we'll use sample data based on URL parameter

// Get lesson ID from URL
$lesson_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Sample lesson data (will be replaced with API call)
$lesson = null;
$error_message = "";

if ($lesson_id > 0) {
    // Sample data for demo
    $lesson = [
        'id' => $lesson_id,
        'title' => 'Introduction à la Grammaire Française',
        'category_id' => '2', // Langue (Tronc Commun)
        'content' => 'La grammaire française est l\'ensemble des règles qui régissent la structure de la langue française. Elle comprend plusieurs parties : la morphologie, la syntaxe, la sémantique et la phonétique.

La morphologie étudie la forme des mots et leurs variations. La syntaxe s\'intéresse à la manière dont les mots se combinent pour former des phrases. La sémantique concerne le sens des mots et des phrases, tandis que la phonétique traite des sons de la langue.

Une bonne maîtrise de la grammaire est essentielle pour bien s\'exprimer en français, tant à l\'écrit qu\'à l\'oral.',
        'video_url' => 'https://www.youtube.com/embed/example123',
        'created_at' => '2025-01-15 10:30:00',
        'updated_at' => '2025-01-20 14:45:00',
        'category_name' => 'Langue'
    ];
} else {
    $error_message = "Aucun ID de leçon spécifié.";
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - Modifier la Leçon</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Edit Lesson CSS -->
    <style>
    <?php include 'edit_lesson.css'; ?>
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
                    <h1 class="h3"><i class="fas fa-edit me-2"></i>Modifier la Leçon</h1>
                    <a href="/?page=manage-lessons" class="btn btn-secondary">
                        <i class="fas fa-arrow-left me-2"></i>Retour à la liste
                    </a>
                </div>
                
                <?php if (!$lesson): ?>
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <?php echo htmlspecialchars($error_message); ?>
                </div>
                <div class="text-center mt-4">
                    <a href="/?page=manage-lessons" class="btn btn-primary">
                        <i class="fas fa-arrow-left me-2"></i>Retour à la liste des leçons
                    </a>
                </div>
                
                <?php else: ?>
                
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
                    <form method="POST" action="" id="editLessonForm">
                        <input type="hidden" id="lesson_id" name="lesson_id" value="<?php echo $lesson['id']; ?>">
                        
                        <div class="row">
                            <div class="col-md-8 mb-3">
                                <label for="title" class="form-label">
                                    <i class="fas fa-heading me-2"></i>Titre de la leçon <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" id="title" name="title" 
                                       value="<?php echo htmlspecialchars($lesson['title']); ?>" 
                                       placeholder="Ex: Les Articles Définis et Indéfinis" required>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label for="category_id" class="form-label">
                                    <i class="fas fa-folder me-2"></i>Catégorie <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="category_id" name="category_id" required>
                                    <option value="">Sélectionnez une catégorie</option>
                                    <optgroup label="Tronc Commun">
                                        <option value="1" <?php echo ($lesson['category_id'] == '1') ? 'selected' : ''; ?>>Lecture</option>
                                        <option value="2" <?php echo ($lesson['category_id'] == '2') ? 'selected' : ''; ?>>Langue</option>
                                        <option value="3" <?php echo ($lesson['category_id'] == '3') ? 'selected' : ''; ?>>Production écrite</option>
                                        <option value="4" <?php echo ($lesson['category_id'] == '4') ? 'selected' : ''; ?>>Production orale</option>
                                        <option value="5" <?php echo ($lesson['category_id'] == '5') ? 'selected' : ''; ?>>Travaux encadrés</option>
                                        <option value="6" <?php echo ($lesson['category_id'] == '6') ? 'selected' : ''; ?>>Résumés</option>
                                    </optgroup>
                                    <optgroup label="1ère Année Bac">
                                        <option value="7" <?php echo ($lesson['category_id'] == '7') ? 'selected' : ''; ?>>Étude de texte</option>
                                        <option value="8" <?php echo ($lesson['category_id'] == '8') ? 'selected' : ''; ?>>Langue</option>
                                        <option value="9" <?php echo ($lesson['category_id'] == '9') ? 'selected' : ''; ?>>Production écrite</option>
                                        <option value="10" <?php echo ($lesson['category_id'] == '10') ? 'selected' : ''; ?>>Production orale</option>
                                        <option value="11" <?php echo ($lesson['category_id'] == '11') ? 'selected' : ''; ?>>Travaux encadrés</option>
                                        <option value="12" <?php echo ($lesson['category_id'] == '12') ? 'selected' : ''; ?>>Résumés</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="content" class="form-label">
                                <i class="fas fa-align-left me-2"></i>Contenu de la leçon <span class="text-danger">*</span>
                            </label>
                            <textarea class="form-control" id="content" name="content" rows="8" 
                                      placeholder="Écrivez le contenu de la leçon ici..." required><?php echo htmlspecialchars($lesson['content']); ?></textarea>
                            <div class="form-text">
                                Utilisez des sauts de ligne pour les paragraphes. Le texte sera affiché tel quel.
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label for="video_url" class="form-label">
                                <i class="fas fa-video me-2"></i>URL de la vidéo (optionnel)
                            </label>
                            <input type="url" class="form-control" id="video_url" name="video_url" 
                                   value="<?php echo htmlspecialchars($lesson['video_url'] ?? ''); ?>" 
                                   placeholder="Ex: https://www.youtube.com/embed/video_id">
                            <div class="form-text">
                                URL d'intégration YouTube (format embed) ou autre service de vidéo.
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between">
                            <a href="/cours" target="_blank" class="btn btn-info">
                                <i class="fas fa-eye me-2"></i>Voir la leçon
                            </a>
                            <div class="d-flex gap-2">
                                <a href="/?page=manage-quiz&lesson_id=<?php echo $lesson['id']; ?>" class="btn btn-warning">
                                    <i class="fas fa-question-circle me-2"></i>Gérer le Quiz
                                </a>
                                <button type="submit" class="btn btn-primary" id="submit-btn">
                                    <i class="fas fa-save me-2"></i>Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                    </form>
                    
                    <!-- Delete Section -->
                    <div class="delete-section">
                        <h5 class="text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Zone dangereuse</h5>
                        <p class="text-muted">La suppression est irréversible. Toutes les questions de quiz associées seront également supprimées.</p>
                        
                        <button type="button" class="btn btn-danger" id="delete-btn">
                            <i class="fas fa-trash me-2"></i>Supprimer définitivement cette leçon
                        </button>
                    </div>
                </div>
                
                <div class="alert alert-info mt-4">
                    <h5><i class="fas fa-info-circle me-2"></i>Informations sur la leçon</h5>
                    <ul class="mb-0" id="lesson-info">
                        <li>ID: <?php echo $lesson['id']; ?></li>
                        <li>Créée le: <?php echo date('d/m/Y à H:i', strtotime($lesson['created_at'])); ?></li>
                        <li>Dernière modification: <?php echo date('d/m/Y à H:i', strtotime($lesson['updated_at'])); ?></li>
                        <li>Catégorie actuelle: <?php echo htmlspecialchars($lesson['category_name']); ?></li>
                    </ul>
                </div>
                
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Edit Lesson JavaScript -->
    <script>
    <?php include 'edit_lesson.js'; ?>
    </script>
</body>
</html>