<?php
// dashboard.php - Complete dashboard page
// We'll handle backend authentication separately later
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - Tableau de bord</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Dashboard CSS -->
    <style>
    <?php include 'dashboard.css'; ?>
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 sidebar">
                <div class="sidebar-header">
                    <h4><i class="fas fa-graduation-cap me-2"></i>Admin Français</h4>
                    <p class="text-muted small mb-0">Bienvenue, Admin</p>
                </div>
                
                <nav class="nav flex-column mt-4">
                    <a class="nav-link active" href="/?page=dashboard">
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
                    <h1 class="h3">Tableau de bord</h1>
                    <span class="badge bg-primary">Admin</span>
                </div>
                
                <!-- Stats Cards -->
                <div class="row">
                    <!-- Tronc Commun Courses -->
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #4cc9f0, #4361ee);">
                                <i class="fas fa-book text-white"></i>
                            </div>
                            <h4 id="tronc-commun-count">0</h4>
                            <p class="text-muted mb-0">Cours Tronc Commun</p>
                        </div>
                    </div>
                    
                    <!-- 1ère Année Bac Courses -->
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #f72585, #b5179e);">
                                <i class="fas fa-university text-white"></i>
                            </div>
                            <h4 id="bac-count">0</h4>
                            <p class="text-muted mb-0">Cours 1ère Année Bac</p>
                        </div>
                    </div>
                    
                    <!-- Total Exams -->
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #38b000, #2d00a3);">
                                <i class="fas fa-file-alt text-white"></i>
                            </div>
                            <h4 id="exams-count">0</h4>
                            <p class="text-muted mb-0">Examens Totaux</p>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="fas fa-bolt me-2"></i>Actions Rapides</h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <a href="/?page=add-lesson" class="btn btn-primary w-100">
                                            <i class="fas fa-plus me-2"></i>Nouvelle Leçon
                                        </a>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <a href="/?page=add-exam" class="btn btn-success w-100">
                                            <i class="fas fa-plus me-2"></i>Nouvel Examen
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Dashboard JavaScript -->
    <script>
    <?php include 'dashboard.js'; ?>
    </script>
</body>
</html>