<?php
// Update exam
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once '../../includes/config.php';

// Check admin authentication
requireAdminAuth();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Méthode non autorisée', null, 405);
}

// Check if we have form data
if (empty($_POST) && empty($_FILES)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        $_POST = $input;
    } else {
        jsonResponse(false, 'Données de formulaire requises');
    }
}

// Validate required fields
$required_fields = ['id', 'title'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        jsonResponse(false, "Le champ '$field' est obligatoire");
    }
}

// Sanitize inputs
$exam_id = intval($_POST['id']);
$title = sanitizeInput($_POST['title']);
$description = isset($_POST['description']) ? sanitizeInput($_POST['description']) : null;
$exam_year = isset($_POST['exam_year']) && !empty($_POST['exam_year']) ? intval($_POST['exam_year']) : null;
$level_slug = '1ere-annee-bac';

// Check delete flags 
$delete_exam_pdf = isset($_POST['delete_exam_pdf']) && $_POST['delete_exam_pdf'] == '1';
$delete_correction_langue_pdf = isset($_POST['delete_correction_langue_pdf']) && $_POST['delete_correction_langue_pdf'] == '1';
$delete_correction_production_pdf = isset($_POST['delete_correction_production_pdf']) && $_POST['delete_correction_production_pdf'] == '1';

try {
    $conn = getDBConnection();
    
    // First, get current exam data
    $stmt = $conn->prepare("SELECT * FROM exams WHERE id = ?");
    $stmt->bind_param("i", $exam_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(false, 'Examen non trouvé');
    }
    
    $current_exam = $result->fetch_assoc();
    $stmt->close();
    
    // Keep current file paths 
    $exam_pdf_path = $current_exam['exam_pdf_path'];
    $correction_langue_path = $current_exam['correction_langue_path'];
    $correction_production_path = $current_exam['correction_production_path'];
    
    // Function to upload PDF file (same as create.php but with delete handling)
    function uploadPDFFile($file_input, $type, $current_path = null) {
        if (!isset($file_input) || $file_input['error'] == UPLOAD_ERR_NO_FILE) {
            return $current_path; // Keep existing file
        }
        
        if ($file_input['error'] != UPLOAD_ERR_OK) {
            throw new Exception("Erreur lors du téléchargement du fichier $type.");
        }
        
        // Check file size (max 10MB)
        $max_size = 10 * 1024 * 1024; // 10MB
        if ($file_input['size'] > $max_size) {
            throw new Exception("Le fichier $type est trop volumineux. Maximum 10MB.");
        }
        
        // Check file type
        $allowed_types = ['application/pdf'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $file_type = finfo_file($finfo, $file_input['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($file_type, $allowed_types)) {
            throw new Exception("Seuls les fichiers PDF sont autorisés pour $type. Type reçu: $file_type");
        }
        
        // Delete old file if exists
        if ($current_path && file_exists(dirname(__DIR__, 2) . '/' . $current_path)) {
            unlink(dirname(__DIR__, 2) . '/' . $current_path);
        }
        
        // Generate unique filename
        $timestamp = time();
        $random_id = uniqid();
        $original_name = basename($file_input['name']);
        $safe_name = preg_replace('/[^a-zA-Z0-9\._-]/', '_', $original_name);
        $filename = "{$type}_{$timestamp}_{$random_id}_{$safe_name}";
        
        // Ensure upload directory exists
        $upload_dir = dirname(__DIR__, 2) . '/uploads/exams/';
        if (!file_exists($upload_dir)) {
            if (!mkdir($upload_dir, 0755, true)) {
                throw new Exception("Impossible de créer le répertoire: $upload_dir");
            }
        }
        
        $destination = $upload_dir . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file_input['tmp_name'], $destination)) {
            $last_error = error_get_last();
            $error_msg = $last_error ? $last_error['message'] : 'Unknown error';
            throw new Exception("Erreur lors de l'enregistrement du fichier $type: $error_msg");
        }
        
        // Return relative path for database storage 
        return 'backend/uploads/exams/' . $filename;
    }
    
    // Handle file deletions
    if ($delete_exam_pdf && $exam_pdf_path) {
        if (file_exists(dirname(__DIR__, 2) . '/' . $exam_pdf_path)) {
            unlink(dirname(__DIR__, 2) . '/' . $exam_pdf_path);
        }
        $exam_pdf_path = null;
    }
    
    if ($delete_correction_langue_pdf && $correction_langue_path) {
        if (file_exists(dirname(__DIR__, 2) . '/' . $correction_langue_path)) {
            unlink(dirname(__DIR__, 2) . '/' . $correction_langue_path);
        }
        $correction_langue_path = null;
    }
    
    if ($delete_correction_production_pdf && $correction_production_path) {
        if (file_exists(dirname(__DIR__, 2) . '/' . $correction_production_path)) {
            unlink(dirname(__DIR__, 2) . '/' . $correction_production_path);
        }
        $correction_production_path = null;
    }
    
    // Upload new exam PDF if provided
    if (isset($_FILES['exam_pdf']) && $_FILES['exam_pdf']['error'] != UPLOAD_ERR_NO_FILE) {
        $exam_pdf_path = uploadPDFFile($_FILES['exam_pdf'], 'exam', $exam_pdf_path);
    }
    
    // Upload new correction langue PDF if provided
    if (isset($_FILES['correction_langue_pdf']) && $_FILES['correction_langue_pdf']['error'] != UPLOAD_ERR_NO_FILE) {
        $correction_langue_path = uploadPDFFile($_FILES['correction_langue_pdf'], 'correction_langue', $correction_langue_path);
    }
    
    // Upload new correction production PDF if provided 
    if (isset($_FILES['correction_production_pdf']) && $_FILES['correction_production_pdf']['error'] != UPLOAD_ERR_NO_FILE) {
        $correction_production_path = uploadPDFFile($_FILES['correction_production_pdf'], 'correction_production', $correction_production_path);
    }
    
    // Update exam in database 
    $stmt = $conn->prepare("
        UPDATE exams 
        SET title = ?, 
            description = ?, 
            exam_pdf_path = ?, 
            correction_langue_path = ?, 
            correction_production_path = ?,
            level_slug = ?, 
            exam_year = ?, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    ");
    
    if (!$stmt) {
        throw new Exception("Erreur de préparation de la requête: " . $conn->error);
    }
    
    $stmt->bind_param(
        "ssssssii",
        $title,
        $description,
        $exam_pdf_path,
        $correction_langue_path,
        $correction_production_path,
        $level_slug,
        $exam_year,
        $exam_id
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Erreur d'exécution de la requête: " . $stmt->error);
    }
    
    // Get updated exam for response
    $select_stmt = $conn->prepare("SELECT * FROM exams WHERE id = ?");
    $select_stmt->bind_param("i", $exam_id);
    $select_stmt->execute();
    $result = $select_stmt->get_result();
    $updated_exam = $result->fetch_assoc();
    
    // Convert file paths to URLs 
    if (!empty($updated_exam['exam_pdf_path'])) {
        $updated_exam['exam_pdf_url'] = '/' . ltrim($updated_exam['exam_pdf_path'], '/');
    }
    if (!empty($updated_exam['correction_langue_path'])) {
        $updated_exam['correction_langue_url'] = '/' . ltrim($updated_exam['correction_langue_path'], '/');
    }
    if (!empty($updated_exam['correction_production_path'])) {
        $updated_exam['correction_production_url'] = '/' . ltrim($updated_exam['correction_production_path'], '/');
    }
    
    $stmt->close();
    $select_stmt->close();
    $conn->close();
    
    jsonResponse(true, 'Examen modifié avec succès!', [
        'exam' => $updated_exam
    ]);
    
} catch (Exception $e) {
    jsonResponse(false, 'Erreur: ' . $e->getMessage());
}
?>