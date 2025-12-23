<style>
<?php include 'filters.css'; ?>
</style>

<!-- Filters Section -->
<div class="container"> 
    <section class="filters-card">
        <h5 class="mb-3">
            <i class="fas fa-filter me-2"></i>Filtrer par année
        </h5>
        <div class="row">
            <div class="col-12 mb-3">
                <div id="year-filters">
                    <!-- Years will be loaded dynamically -->
                    <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <span id="results-count">Chargement...</span>
            <button class="btn btn-sm btn-outline-secondary" id="clear-filters">
                <i class="fas fa-times me-1"></i>Afficher tous
            </button>
        </div>
    </section>
</div>  

<!-- Filters Component JavaScript -->
<script>
<?php include 'filters.js'; ?>
</script>