<?php
// Get lesson ID from URL
$lesson_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($lesson_id <= 0) {
    $error_message = "Aucun ID de leçon spécifié.";
    $show_form = false;
} else {
    $error_message = "";
    $show_form = true;
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
                
                <?php if (!$show_form): ?>
                <!-- No lesson ID specified -->
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Aucun ID de leçon spécifié.
                </div>
                <div class="text-center mt-4">
                    <a href="/?page=manage-lessons" class="btn btn-primary">
                        <i class="fas fa-arrow-left me-2"></i>Retour à la liste des leçons
                    </a>
                </div>
                
                <?php else: ?>
                
                <!-- Loading State -->
                <div id="loading-state" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                    <p class="mt-3">Chargement des données de la leçon...</p>
                </div>
                
                <!-- Form (initially hidden) -->
                <div class="form-container d-none" id="lesson-form-container">
                    <form method="POST" action="" id="editLessonForm">
                        <input type="hidden" id="lesson_id" name="lesson_id" value="<?php echo $lesson_id; ?>">
                        
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
                                    <option value="">Chargement des catégories...</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- HTML Content Section  -->
                        <div class="mb-4">
                            <h5 class="mb-3">
                                <i class="fas fa-edit me-2"></i>Contenu de la leçon (HTML)
                            </h5>
                            
                            <!-- Instructions Card -->
                            <div class="card mb-3">
                                <div class="card-header bg-success text-white">
                                    <h6 class="mb-0"><i class="fas fa-lightbulb me-2"></i>Workflow Simplicime (100% Garanti)</h6>
                                </div>
                                <div class="card-body">
                                    <ol class="mb-3">
                                        <li>Créez votre leçon dans <strong>Google Docs</strong> ou <strong>Microsoft Word</strong></li>
                                        <li>Copiez tout le contenu (Ctrl+A, Ctrl+C)</li>
                                        <li>Allez sur <a href="https://wordtohtml.net" target="_blank" class="fw-bold">WordToHTML.net</a></li>
                                        <li>Collez, convertissez, copiez l'HTML généré</li>
                                        <li>Utilisez la <strong>Commande Magique</strong> ci-dessous avec DeepSeek AI</li>
                                        <li>Collez l'HTML corrigé dans le champ ci-dessous</li>
                                        <li>Enregistrez votre leçon</li>
                                    </ol>
                                    
                                    <div class="alert alert-info mb-0">
                                        <i class="fas fa-info-circle me-2"></i>
                                        <strong>Important :</strong> Ce système accepte maintenant le HTML formaté. 
                                        Les couleurs, polices, listes et styles seront préservés.
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Magic Command Card -->
                            <div class="card mb-3">
                                <div class="card-header bg-primary text-white">
                                    <h6 class="mb-0"><i class="fas fa-magic me-2"></i>Commande Magique pour DeepSeek AI</h6>
                                </div>
                                <div class="card-body">
                                    <div class="alert alert-warning">
                                        <i class="fas fa-exclamation-triangle me-2"></i>
                                        <strong>Étape cruciale :</strong> Utilisez cette commande pour corriger l'HTML de WordToHTML.net
                                    </div>
                                    
                                    <div class="bg-dark text-light p-3 rounded mb-3" style="font-family: 'Courier New', monospace; font-size: 14px;">
                                        Corrige cet HTML de WordToHTML.net pour une leçon éducative :<br><br>
                                        1. Supprime les paragraphes vides et les balises &lt;br&gt; excessives<br>
                                        2. Corrige les &lt;p&gt; à l'intérieur des &lt;li&gt;<br>
                                        3. Assure que les listes numérotées s'affichent correctement<br>
                                        4. Garde TOUS les styles (couleurs, polices, espacements)<br>
                                        5. Retourne un HTML propre et valide<br><br>
                                        HTML à corriger :<br><br>
                                        [COLLE_TON_HTML_ICI]
                                    </div>
                                    
                                    <div class="d-flex gap-2">
                                        <button type="button" class="btn btn-primary" onclick="copyMagicCommand()">
                                            <i class="fas fa-copy me-2"></i>Copier la Commande Magique
                                        </button>
                                        <a href="https://chat.deepseek.com/" target="_blank" class="btn btn-outline-primary">
                                            <i class="fas fa-external-link-alt me-2"></i>Ouvrir DeepSeek AI
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Content Field -->
                            <div class="mb-3">
                                <label for="content" class="form-label required">
                                    <i class="fas fa-code me-2"></i>Contenu HTML <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control" id="content" name="content" rows="12" 
                                          placeholder="Collez votre HTML corrigé ici..."
                                          style="font-family: 'Courier New', monospace; font-size: 14px;" required></textarea>
                                <div class="form-text">
                                    Collez l'HTML généré par WordToHTML.net et corrigé par DeepSeek AI. 
                                    Le contenu sera affiché avec mise en forme complète.
                                </div>
                            </div>
                            
                            <!-- Preview Button -->
                            <div class="mb-3">
                                <button type="button" class="btn btn-outline-primary" id="preview-btn">
                                    <i class="fas fa-eye me-2"></i>Aperçu du contenu
                                </button>
                                <small class="text-muted ms-2">Cliquez pour voir comment le contenu apparaîtra aux étudiants</small>
                            </div>
                            
                            <!-- Preview Area -->
                            <div class="card d-none mb-4" id="preview-card">
                                <div class="card-header bg-light">
                                    <h6 class="mb-0"><i class="fas fa-desktop me-2"></i>Aperçu</h6>
                                </div>
                                <div class="card-body">
                                    <div id="preview-content" class="lesson-content-preview">
                                        <!-- Preview will appear here -->
                                    </div>
                                    <div class="alert alert-info mt-3 mb-0">
                                        <i class="fas fa-info-circle me-2"></i>
                                        Aperçu approximatif. L'affichage final peut varier légèrement.
                                    </div>
                                </div>
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
                            <button type="button" class="btn btn-info" id="view-lesson-btn">
                                <i class="fas fa-eye me-2"></i>Voir la leçon
                            </button>
                            <div class="d-flex gap-2">
                                <a href="/?page=manage-quiz&lesson_id=<?php echo $lesson_id; ?>" class="btn btn-warning">
                                    <i class="fas fa-question-circle me-2"></i>Gérer le Quiz
                                </a>
                                <button type="submit" class="btn btn-primary" id="submit-btn">
                                    <i class="fas fa-save me-2"></i>Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                    </form>
                    
                    <!-- Delete Section -->
                    <div class="delete-section mt-5">
                        <h5 class="text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Zone dangereuse</h5>
                        <p class="text-muted">La suppression est irréversible. Toutes les questions de quiz associées seront également supprimées.</p>
                        
                        <button type="button" class="btn btn-danger" id="delete-btn">
                            <i class="fas fa-trash me-2"></i>Supprimer définitivement cette leçon
                        </button>
                    </div>
                </div>
                
                <!-- Lesson Info (will be populated by JS) -->
                <div class="alert alert-info mt-4 d-none" id="lesson-info-container">
                    <h5><i class="fas fa-info-circle me-2"></i>Informations sur la leçon</h5>
                    <ul class="mb-0" id="lesson-info">
                        <!-- Will be populated by JavaScript -->
                    </ul>
                </div>
                
                <!-- Lesson Not Found (hidden by default) -->
                <div class="alert alert-danger d-none" id="lesson-not-found">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Leçon non trouvée.
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
    
    <!-- Magic Command Copy Function (Added from add_lesson.php) -->
    <script>
    function copyMagicCommand() {
        const command = `Corrige cet HTML de WordToHTML.net pour une leçon éducative :

1. Supprime les paragraphes vides et les balises <br> excessives
2. Corrige les <p> à l'intérieur des <li>
3. Assure que les listes numérotées s'affichent correctement
4. Garde TOUS les styles (couleurs, polices, espacements)
5. Retourne un HTML propre et valide

HTML à corriger :

[COLLE_TON_HTML_ICI]`;
        
        navigator.clipboard.writeText(command).then(() => {
            alert('✓ Commande magique copiée !\n\nCollez-la dans DeepSeek AI, remplacez [COLLE_TON_HTML_ICI] par votre HTML, et collez le résultat corrigé dans le champ ci-dessus.');
        }).catch(err => {
            console.error('Erreur de copie:', err);
            alert('Erreur de copie. Veuillez copier manuellement le texte en surbrillance.');
        });
    }
    </script>
</body>
</html>