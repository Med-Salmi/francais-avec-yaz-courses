<?php
// manage_quiz.php - Manage Quiz component
// Get lesson ID from URL
$lesson_id = isset($_GET['lesson_id']) ? intval($_GET['lesson_id']) : 0;

if ($lesson_id <= 0) {
    $error_message = "Aucun ID de leçon spécifié.";
    $show_content = false;
} else {
    $error_message = "";
    $show_content = true;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - Gérer le Quiz</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Manage Quiz CSS -->
    <style>
    <?php include 'manage_quiz.css'; ?>
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
                    <h1 class="h3"><i class="fas fa-question-circle me-2"></i>Gérer le Quiz</h1>
                    <div>
                        <a href="/?page=edit-lesson&id=<?php echo $lesson_id; ?>" class="btn btn-secondary me-2">
                            <i class="fas fa-arrow-left me-2"></i>Retour à la leçon
                        </a>
                        <a href="/?page=manage-lessons" class="btn btn-outline-secondary">
                            <i class="fas fa-list me-2"></i>Toutes les leçons
                        </a>
                    </div>
                </div>
                
                <?php if (!$show_content): ?>
                <!-- No lesson ID specified -->
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
                
                <!-- Success Message -->
                <div class="alert alert-success alert-dismissible fade show d-none" role="alert" id="success-message">
                    <i class="fas fa-check-circle me-2"></i>
                    <span id="message-text"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                
                <!-- Error Message -->
                <div class="alert alert-danger alert-dismissible fade show d-none" role="alert" id="error-message">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <span id="error-text"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                
                <!-- Loading State -->
                <div id="loading-state" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                    <p class="mt-3">Chargement des données du quiz...</p>
                </div>
                
                <!-- Content (initially hidden) -->
                <div class="d-none" id="content-container">
                    <!-- Lesson Info -->
                    <div class="alert alert-primary mb-4" id="lesson-info-container">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-1"><i class="fas fa-book me-2"></i><span id="lesson-title">Chargement...</span></h5>
                                <p class="mb-0">ID: <span id="lesson-id"><?php echo $lesson_id; ?></span> | Gestion des questions de quiz</p>
                            </div>
                            <div class="text-end">
                                <button class="btn btn-sm btn-outline-primary" id="refresh-btn">
                                    <i class="fas fa-sync-alt me-1"></i>Actualiser
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Existing Questions Section -->
                    <div class="mb-5" id="questions-section">
                        <h4 class="mb-3">
                            <i class="fas fa-list me-2"></i>Questions existantes
                            <span class="badge bg-primary" id="questions-count">0</span>
                        </h4>
                        
                        <div class="alert alert-info d-none" id="no-questions-message">
                            <i class="fas fa-info-circle me-2"></i>
                            Aucune question de quiz pour cette leçon. Ajoutez-en une ci-dessous.
                        </div>
                        
                        <div id="questions-list">
                            <!-- Questions will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Add New Question Form -->
                    <div class="form-container mb-5">
                        <h4 class="mb-4"><i class="fas fa-plus-circle me-2"></i>Ajouter une nouvelle question</h4>
                        
                        <form id="add-question-form">
                            <input type="hidden" id="form-lesson-id" value="<?php echo $lesson_id; ?>">
                            
                            <div class="mb-3">
                                <label for="question" class="form-label">
                                    Question <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control" id="question" name="question" rows="3" 
                                          placeholder="Posez votre question ici..." required></textarea>
                                <div class="form-text text-end">
                                    <span id="question-char-count">0</span> caractères
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="option_a" class="form-label">
                                        Option A <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="option_a" name="option_a" 
                                           placeholder="Première option" required>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <label for="option_b" class="form-label">
                                        Option B <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="option_b" name="option_b" 
                                           placeholder="Deuxième option" required>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <label for="option_c" class="form-label">
                                        Option C
                                    </label>
                                    <input type="text" class="form-control" id="option_c" name="option_c" 
                                           placeholder="Troisième option (optionnelle)">
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <label for="option_d" class="form-label">
                                        Option D
                                    </label>
                                    <input type="text" class="form-control" id="option_d" name="option_d" 
                                           placeholder="Quatrième option (optionnelle)">
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="correct_answer" class="form-label">
                                        Réponse correcte <span class="text-danger">*</span>
                                    </label>
                                    <select class="form-select" id="correct_answer" name="correct_answer" required>
                                        <option value="">Sélectionnez...</option>
                                        <option value="a">Option A</option>
                                        <option value="b">Option B</option>
                                        <option value="c">Option C</option>
                                        <option value="d">Option D</option>
                                    </select>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <label for="explanation" class="form-label">
                                        Explication (optionnelle)
                                    </label>
                                    <textarea class="form-control" id="explanation" name="explanation" rows="2" 
                                              placeholder="Explication de la réponse correcte..."></textarea>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between">
                                <button type="reset" class="btn btn-secondary" id="reset-btn">
                                    <i class="fas fa-redo me-2"></i>Effacer
                                </button>
                                <button type="submit" class="btn btn-primary" id="submit-btn">
                                    <i class="fas fa-plus me-2"></i>Ajouter la question
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Tips Section -->
                    <div class="alert alert-info">
                        <h5><i class="fas fa-lightbulb me-2"></i>Conseils pour les quiz</h5>
                        <ul class="mb-0">
                            <li>Les options A et B sont obligatoires, C et D sont optionnelles</li>
                            <li>L'explication aide les étudiants à comprendre pourquoi la réponse est correcte</li>
                            <li>Idéalement, chaque leçon devrait avoir 3-5 questions de quiz</li>
                            <li>Testez toujours le quiz depuis la page étudiant après l'ajout</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Lesson Not Found Message -->
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
    
    <!-- Manage Quiz JavaScript -->
    <script>
    <?php include 'manage_quiz.js'; ?>
    </script>
</body>
</html>