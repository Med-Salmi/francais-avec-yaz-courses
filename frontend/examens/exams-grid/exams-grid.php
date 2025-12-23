<style>
<?php include 'exams-grid.css'; ?>
</style>

<!-- Exams Grid Section -->
<section id="exams-section">
    <div class="container">
        <h3 class="mb-4">
            <i class="fas fa-list me-2"></i>Examens disponibles
            <span class="badge bg-primary fs-6" id="exams-count-badge">0</span>
        </h3>
        <div class="row" id="exams-container">
            <!-- Exams will be loaded here dynamically -->
            <div class="col-12">
                <div class="loading-spinner">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                    <p class="mt-3">Chargement des examens...</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Exams Grid Component JavaScript -->
<script>
<?php include 'exams-grid.js'; ?>
</script>   