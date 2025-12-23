<style>
<?php include 'lesson-item.css'; ?>
</style>

<!-- Lesson Item Modal Structure -->
<div class="modal fade" id="lessonModal" tabindex="-1" aria-labelledby="lessonModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="lessonModalLabel">
                    <span id="lessonModalTitle">Chargement de la leçon...</span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="lessonContentContainer">
                    <!-- Loading state -->
                    <div class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Chargement de la leçon...</span>
                        </div>
                        <p class="mt-3">Chargement du contenu de la leçon...</p>
                    </div>
                </div>
                
                <!-- Simplified Lesson Content Template (hidden) -->
                <div id="lessonContentTemplate" style="display: none;">
                    <!-- Section 1: Contenu de la leçon -->
                    <div class="lesson-content-section mb-5">
                        <h4 class="section-title">
                            <i class="fas fa-book-open me-2"></i>Contenu de la leçon
                        </h4>
                        <div class="card">
                            <div class="card-body">
                                <div class="lesson-content" id="templateLessonContent">
                                    <p>Chargement du contenu...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Section 2: Vidéo de la leçon -->
                    <div class="lesson-video-section mb-5">
                        <h4 class="section-title">
                            <i class="fas fa-video me-2"></i>Vidéo de la leçon
                        </h4>
                        <div class="card">
                            <div class="card-body">
                                <div class="lesson-video-container" id="templateLessonVideo">
                                    <div class="ratio ratio-16x9">
                                        <iframe 
                                            src=""
                                            title="YouTube video player" 
                                            frameborder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowfullscreen>
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="quizSection" class="quiz-section">
                    <h5>
                        <i class="fas fa-question-circle me-2"></i>Quiz de la Leçon
                    </h5>
                    <div id="quizQuestions">
                        <!-- Mock Quiz Questions for Frontend Testing -->
                        <div class="quiz-question mb-3">
                            Q1: Quelle est la capitale de la France ?
                        </div>
                        <div class="mb-4">
                            <div class="quiz-option" data-question="1" data-option="a">
                                A. Londres
                            </div>
                            <div class="quiz-option" data-question="1" data-option="b">
                                B. Berlin
                            </div>
                            <div class="quiz-option" data-question="1" data-option="c">
                                C. Paris
                            </div>
                            <div class="quiz-option" data-question="1" data-option="d">
                                D. Madrid
                            </div>
                            <div class="explanation" id="explanation-1" style="display: none;">
                                <strong>Explication:</strong> Paris est la capitale de la France depuis le 6ème siècle.
                            </div>
                        </div>
                        
                        <div class="quiz-question mb-3">
                            Q2: Lequel de ces mots est un verbe ?
                        </div>
                        <div class="mb-4">
                            <div class="quiz-option" data-question="2" data-option="a">
                                A. Table
                            </div>
                            <div class="quiz-option" data-question="2" data-option="b">
                                B. Manger
                            </div>
                            <div class="quiz-option" data-question="2" data-option="c">
                                C. Belle
                            </div>
                            <div class="quiz-option" data-question="2" data-option="d">
                                D. Rapidement
                            </div>
                            <div class="explanation" id="explanation-2" style="display: none;">
                                <strong>Explication:</strong> "Manger" est un verbe qui décrit une action.
                            </div>
                        </div>
                        
                        <div class="quiz-question mb-3">
                            Q3: "Je _____ à l'école tous les jours." Complétez la phrase.
                        </div>
                        <div class="mb-4">
                            <div class="quiz-option" data-question="3" data-option="a">
                                A. vais
                            </div>
                            <div class="quiz-option" data-question="3" data-option="b">
                                B. va
                            </div>
                            <div class="quiz-option" data-question="3" data-option="c">
                                C. allez
                            </div>
                            <div class="quiz-option" data-question="3" data-option="d">
                                D. allons
                            </div>
                            <div class="explanation" id="explanation-3" style="display: none;">
                                <strong>Explication:</strong> "Je vais" est la conjugaison correcte du verbe "aller" à la première personne du singulier.
                            </div>
                        </div>
                    </div>
                    <button
                        id="submitQuiz"
                        class="btn btn-primary mt-3"
                    >
                        <i class="fas fa-paper-plane me-2"></i>Soumettre le Quiz
                    </button>
                    <div id="quizResult" class="mt-3" style="display: none"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    <i class="fas fa-times me-2"></i>Fermer
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Lesson Item Modal JavaScript -->
<script>
<?php include 'lesson-item.js'; ?>
</script>