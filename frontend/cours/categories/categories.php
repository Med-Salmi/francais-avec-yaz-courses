<style>
<?php include 'categories.css'; ?>
</style>

<!-- Categories Section -->
<section id="categories-section" class="pb-5 pt-3">
    <div class="container">
        <h3 class="mb-4">Catégories de Cours</h3>
        <div class="row" id="categories-container">
            <!-- Categories will be loaded here -->
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3">Chargement des catégories...</p>
            </div>
        </div>
    </div>
</section>

<!-- Categories Component JavaScript -->
<script>
<?php include 'categories.js'; ?>
</script>