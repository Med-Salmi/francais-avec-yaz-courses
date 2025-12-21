<?php
// edit_exam.php - Edit Exam page
// UPDATED: Now handles 3 file uploads instead of 2
session_start();

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: /?page=login");
    exit;
}

// Get exam ID from URL for reference
$exam_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - Modifier l'Examen</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Edit Exam CSS -->
    <style>
    <?php include 'edit_exam.css'; ?>
    </style>
</head>
<body>
    <!-- Hidden data for JavaScript -->
    <div id="exam-data" data-exam-id="<?php echo $exam_id; ?>" style="display: none;"></div>
    
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
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
                    <h1 class="h3">
                        <i class="fas fa-edit me-2"></i>Modifier l'examen
                        <small class="text-muted" id="exam-id">#<?php echo $exam_id; ?></small>
                    </h1>
                    <a href="/?page=manage-exams" class="btn btn-outline-secondary">
                        <i class="fas fa-arrow-left me-2"></i>Retour à la liste
                    </a>
                </div>
                
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
                    <p class="mt-3">Chargement des données de l'examen...</p>
                </div>
                
                <!-- Form (initially hidden) -->
                <div class="form-container d-none" id="exam-form-container">
                    <form method="POST" action="" enctype="multipart/form-data" id="editExamForm">
                        <input type="hidden" id="exam_id" name="exam_id" value="<?php echo $exam_id; ?>">
                        
                        <div class="row">
                            <div class="col-md-8">
                                <!-- Basic Information -->
                                <div class="mb-4">
                                    <h5 class="mb-3">
                                        <i class="fas fa-info-circle me-2"></i>Informations de l'examen
                                    </h5>
                                    
                                    <div class="mb-3">
                                        <label for="title" class="form-label required">Titre de l'examen</label>
                                        <input type="text" class="form-control" id="title" name="title" 
                                               required placeholder="Ex: Contrôle Continu - Semestre 1">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="description" class="form-label">Description</label>
                                        <textarea class="form-control" id="description" name="description" 
                                                  rows="3" placeholder="Description optionnelle de l'examen..."></textarea>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="exam_year" class="form-label">Année scolaire</label>
                                        <div class="input-group">
                                            <input type="number" 
                                                   class="form-control" 
                                                   id="exam_year" 
                                                   name="exam_year" 
                                                   min="2000" 
                                                   max="2035" 
                                                   placeholder="Ex: 2024">
                                            <span class="input-group-text">
                                                <i class="fas fa-calendar-alt"></i>
                                            </span>
                                        </div>
                                        <small class="text-muted">Saisissez l'année de l'examen (entre 2000 et 2035)</small>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-4">
                                <!-- Exam Info -->
                                <div class="card mb-4">
                                    <div class="card-header">
                                        <h6 class="mb-0"><i class="fas fa-info-circle me-2"></i>Informations</h6>
                                    </div>
                                    <div class="card-body">
                                        <ul class="list-unstyled mb-0" id="exam-info">
                                            <!-- Will be populated by JS -->
                                        </ul>
                                    </div>
                                </div>
                                
                                <!-- Tips -->
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0"><i class="fas fa-lightbulb me-2"></i>Conseils</h6>
                                    </div>
                                    <div class="card-body">
                                        <ul class="list-unstyled mb-0">
                                            <li class="mb-2">
                                                <i class="fas fa-check text-success me-2"></i>
                                                <small>Taille max: 10MB par fichier</small>
                                            </li>
                                            <li class="mb-2">
                                                <i class="fas fa-check text-success me-2"></i>
                                                <small>Format accepté: PDF uniquement</small>
                                            </li>
                                            <li>
                                                <i class="fas fa-check text-success me-2"></i>
                                                <small>Laissez vide pour conserver le fichier actuel</small>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Current Files (UPDATED: 3 files instead of 2) -->
                        <div class="row mt-4">
                            <!-- Exam File -->
                            <div class="col-md-4 mb-4">
                                <h5 class="mb-3">
                                    <i class="fas fa-file-pdf text-primary me-2"></i>Sujet actuel
                                </h5>
                                <div id="current-exam-file-container">
                                    <!-- Will be populated by JS -->
                                </div>
                                
                                <h6 class="mb-3 mt-3">
                                    <i class="fas fa-upload me-2"></i>Nouveau sujet (optionnel)
                                </h6>
                                <div class="file-upload-area" id="exam-upload-area">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <h6>Cliquez pour télécharger un nouveau sujet</h6>
                                    <p class="text-muted">Remplacera le fichier actuel</p>
                                    <input type="file" id="exam_pdf" name="exam_pdf" 
                                           accept=".pdf,application/pdf" class="d-none">
                                    <div id="exam_file_name" class="file-info">
                                        Aucun nouveau fichier sélectionné
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Correction Langue -->
                            <div class="col-md-4 mb-4">
                                <h5 class="mb-3">
                                    <i class="fas fa-language text-success me-2"></i>Correction Langue actuelle
                                </h5>
                                <div id="current-correction-langue-file-container">
                                    <!-- Will be populated by JS -->
                                </div>
                                
                                <h6 class="mb-3 mt-3">
                                    <i class="fas fa-upload me-2"></i>Nouvelle correction langue (optionnel)
                                </h6>
                                <div class="file-upload-area" id="correction-langue-upload-area">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <h6>Cliquez pour télécharger une nouvelle correction langue</h6>
                                    <p class="text-muted">Remplacera le fichier actuel</p>
                                    <input type="file" id="correction_langue_pdf" name="correction_langue_pdf" 
                                           accept=".pdf,application/pdf" class="d-none">
                                    <div id="correction_langue_file_name" class="file-info">
                                        Aucun nouveau fichier sélectionné
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Correction Production -->
                            <div class="col-md-4 mb-4">
                                <h5 class="mb-3">
                                    <i class="fas fa-edit text-warning me-2"></i>Correction Production actuelle
                                </h5>
                                <div id="current-correction-production-file-container">
                                    <!-- Will be populated by JS -->
                                </div>
                                
                                <h6 class="mb-3 mt-3">
                                    <i class="fas fa-upload me-2"></i>Nouvelle correction production (optionnel)
                                </h6>
                                <div class="file-upload-area" id="correction-production-upload-area">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <h6>Cliquez pour télécharger une nouvelle correction production</h6>
                                    <p class="text-muted">Remplacera le fichier actuel</p>
                                    <input type="file" id="correction_production_pdf" name="correction_production_pdf" 
                                           accept=".pdf,application/pdf" class="d-none">
                                    <div id="correction_production_file_name" class="file-info">
                                        Aucun nouveau fichier sélectionné
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Form Actions -->
                        <div class="row mt-4">
                            <div class="col-12">
                                <div class="d-flex justify-content-between">
                                    <button type="reset" class="btn btn-outline-secondary" id="reset-btn">
                                        <i class="fas fa-times me-2"></i>Annuler
                                    </button>
                                    <div>
                                        <button type="submit" class="btn btn-primary me-2" id="submit-btn">
                                            <i class="fas fa-save me-2"></i>Enregistrer les modifications
                                        </button>
                                        <button type="button" class="btn btn-danger" id="delete-btn">
                                            <i class="fas fa-trash me-2"></i>Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                <!-- Exam Not Found (hidden by default) -->
                <div class="alert alert-danger d-none" id="exam-not-found">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Examen non trouvé.
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Edit Exam JavaScript -->
    <script>
    <?php include 'edit_exam.js'; ?>
    </script>
</body>
</html>