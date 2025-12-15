<!-- Level Selector Component CSS -->
<style>
<?php include 'level-selector.css'; ?>
</style>

<!-- Level Selector Section -->
<div class="container">  <!-- ← ADD CONTAINER HERE -->
    <section class="level-selector text-center">
        <h2 class="mb-4">Choisissez votre niveau</h2>
        <div class="d-flex flex-wrap justify-content-center">
            <button class="btn level-btn active" data-level="tronc-commun" id="btn-tronc-commun">
                <i class="fas fa-book-reader me-2"></i>Tronc Commun
            </button>
            <button class="btn level-btn" data-level="1ere-annee-bac" id="btn-1ere-annee-bac">
                <i class="fas fa-university me-2"></i>1ère Année Bac
            </button>
        </div>
    </section>
</div>  <!-- ← CLOSE CONTAINER -->

<!-- Level Selector Component JavaScript -->
<script>
<?php include 'level-selector.js'; ?>
</script>