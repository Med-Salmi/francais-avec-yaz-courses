<?php
// Simple single admin account
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD_HASH', '$2y$10$xSyNXbUByRtkZ09WUwT8E.OJ2LVGqeC5NoB9YbaTrx5YgjJYevPOC');

// Session configuration
define('SESSION_TIMEOUT', 3600); // 1 hour in seconds

// Security settings
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_ATTEMPT_WINDOW', 900); // 15 minutes in seconds
?>