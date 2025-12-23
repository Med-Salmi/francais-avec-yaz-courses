<?php
// Create new exam

// Turn off error display but log them
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', '/tmp/php_upload_errors.log');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once '../../includes/config.php';

// Start output buffering to catch any stray output
ob_start();

// Check admin authentication
requireAdminAuth();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Méthode non autorisée', null, 405);
}

// Check if it's multipart form data 
if (empty($_POST) && empty($_FILES)) {
    // For JSON input (optional)
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        $_POST = $input;
    } else {
        jsonResponse(false, 'Données de formulaire requises');
    }
}

// Validate required fields
$required_fields = ['title'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        jsonResponse(false, "Le champ '$field' est obligatoire");
    }
}

// Sanitize inputs
$title = sanitizeInput($_POST['title']);
$description = isset($_POST['description']) ? sanitizeInput($_POST['description']) : null;
$exam_year = isset($_POST['exam_year']) && !empty($_POST['exam_year']) ? intval($_POST['exam_year']) : null;
$level_slug = '1ere-annee-bac'; // Fixed level

try {
    $conn = getDBConnection();
    
    // Handle file uploads 
    $exam_pdf_path = null;
    $correction_langue_path = null;
    $correction_production_path = null;
    
    // Function to upload PDF file
    function uploadPDFFile($file_input, $type) {
        if (!isset($file_input) || $file_input['error'] == UPLOAD_ERR_NO_FILE) {
            return null; // No file uploaded
        }
        
        if ($file_input['error'] != UPLOAD_ERR_OK) {
            throw new Exception("Erreur lors du téléchargement du fichier $type. Code: " . $file_input['error']);
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
        
        // Generate unique filename
        $timestamp = time();
        $random_id = uniqid();
        $original_name = basename($file_input['name']);
        $safe_name = preg_replace('/[^a-zA-Z0-9\._-]/', '_', $original_name);
        $filename = "{$type}_{$timestamp}_{$random_id}_{$safe_name}";
        
        // Use absolute path for uploads - files go to backend/uploads/exams/
        $upload_dir = dirname(__DIR__, 2) . '/uploads/exams/';
        
        // Create directory if it doesn't exist
        if (!file_exists($upload_dir)) {
            if (!mkdir($upload_dir, 0755, true)) {
                throw new Exception("Impossible de créer le répertoire: $upload_dir");
            }
        }
        
        // Check if directory is writable
        if (!is_writable($upload_dir)) {
            throw new Exception("Le répertoire n'est pas accessible en écriture: $upload_dir");
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
    
    // Upload exam PDF if provided
    if (isset($_FILES['exam_pdf']) && $_FILES['exam_pdf']['error'] != UPLOAD_ERR_NO_FILE) {
        $exam_pdf_path = uploadPDFFile($_FILES['exam_pdf'], 'exam');
    }
    
    // Upload correction langue PDF if provided 
    if (isset($_FILES['correction_langue_pdf']) && $_FILES['correction_langue_pdf']['error'] != UPLOAD_ERR_NO_FILE) {
        $correction_langue_path = uploadPDFFile($_FILES['correction_langue_pdf'], 'correction_langue');
    }
    
    // Upload correction production PDF if provided 
    if (isset($_FILES['correction_production_pdf']) && $_FILES['correction_production_pdf']['error'] != UPLOAD_ERR_NO_FILE) {
        $correction_production_path = uploadPDFFile($_FILES['correction_production_pdf'], 'correction_production');
    }
    
    // Check that at least one file is uploaded (UPDATED: now checks any of the 3 files)
    if (!$exam_pdf_path && !$correction_langue_path && !$correction_production_path) {
        jsonResponse(false, 'Veuillez télécharger au moins un fichier PDF (sujet ou correction).');
    }
    
    // Insert exam into database 
    $stmt = $conn->prepare("
        INSERT INTO exams (
            title, 
            description, 
            exam_pdf_path, 
            correction_langue_path, 
            correction_production_path,
            level_slug, 
            exam_year
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    if (!$stmt) {
        throw new Exception("Erreur de préparation de la requête: " . $conn->error);
    }
    
    $stmt->bind_param(
        "ssssssi",
        $title,
        $description,
        $exam_pdf_path,
        $correction_langue_path,
        $correction_production_path,
        $level_slug,
        $exam_year
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Erreur d'exécution de la requête: " . $stmt->error);
    }
    
    $exam_id = $stmt->insert_id;
    
    // Get the created exam for response
    $select_stmt = $conn->prepare("SELECT * FROM exams WHERE id = ?");
    $select_stmt->bind_param("i", $exam_id);
    $select_stmt->execute();
    $result = $select_stmt->get_result();
    $created_exam = $result->fetch_assoc();
    
    // Convert file paths to URLs 
    if (!empty($created_exam['exam_pdf_path'])) {
        $created_exam['exam_pdf_url'] = '/' . ltrim($created_exam['exam_pdf_path'], '/');
    }
    if (!empty($created_exam['correction_langue_path'])) {
        $created_exam['correction_langue_url'] = '/' . ltrim($created_exam['correction_langue_path'], '/');
    }
    if (!empty($created_exam['correction_production_path'])) {
        $created_exam['correction_production_url'] = '/' . ltrim($created_exam['correction_production_path'], '/');
    }
    
    $stmt->close();
    $select_stmt->close();
    $conn->close();
    
    // Clear output buffer
    ob_end_clean();
    
    jsonResponse(true, 'Examen créé avec succès!', [
        'exam' => $created_exam,
        'exam_id' => $exam_id
    ]);
    
} catch (Exception $e) {
    // Clean up uploaded files if there was an error 
    if ($exam_pdf_path && file_exists(dirname(__DIR__, 2) . '/' . $exam_pdf_path)) {
        @unlink(dirname(__DIR__, 2) . '/' . $exam_pdf_path);
    }
    if ($correction_langue_path && file_exists(dirname(__DIR__, 2) . '/' . $correction_langue_path)) {
        @unlink(dirname(__DIR__, 2) . '/' . $correction_langue_path);
    }
    if ($correction_production_path && file_exists(dirname(__DIR__, 2) . '/' . $correction_production_path)) {
        @unlink(dirname(__DIR__, 2) . '/' . $correction_production_path);
    }
    
    // Clear output buffer
    ob_end_clean();
    
    jsonResponse(false, 'Erreur: ' . $e->getMessage());
}
?>