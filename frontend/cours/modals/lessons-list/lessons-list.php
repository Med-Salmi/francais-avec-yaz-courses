<!-- Lessons List Modal CSS -->
<style>
<?php include 'lessons-list.css'; ?>
</style>

<!-- Lessons List Modal Structure -->
<div class="modal fade" id="lessonsModal" tabindex="-1" aria-labelledby="lessonsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="lessonsModalLabel">Leçons pour <span id="modalCategoryName"></span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row" id="lessonsListContainer">
                    <!-- Lessons will be loaded here dynamically -->
                </div>
                
                <!-- SIMPLIFIED Lesson Item Template (hidden) -->
                <div class="col-md-6 col-lg-4 mb-3 lesson-item-template" style="display: none;">
                    <div class="card lesson-card h-100">
                        <div class="card-body">
                            <h5 class="card-title lesson-title">Titre de la leçon</h5>
                        </div>
                        <div class="card-footer bg-transparent">
                            <button class="btn btn-primary view-lesson-btn">
                                <i class="fas fa-eye me-2"></i>Voir la leçon
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>

<!-- Lessons List Modal JavaScript -->
<script>
<?php include 'lessons-list.js'; ?>
</script>