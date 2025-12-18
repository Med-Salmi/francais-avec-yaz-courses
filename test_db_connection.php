<?php
// test_db_connection.php
$host = 'localhost';
$username = 'root';
$password = 'YourPassword123!'; // Your MySQL password
$database = 'french_teacher_db'; // Your database name

try {
    $conn = new mysqli($host, $username, $password, $database);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    echo "✅ MySQL Connected successfully!<br>";
    echo "Server version: " . $conn->server_info . "<br>";
    
    // Test query
    $result = $conn->query("SHOW TABLES");
    echo "Tables in database:<br>";
    while ($row = $result->fetch_array()) {
        echo "- " . $row[0] . "<br>";
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo "❌ Connection failed: " . $e->getMessage();
}
?>