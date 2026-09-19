<?php
header("Content-Type: application/json; charset=UTF-8");
ini_set('display_errors', '1');
error_reporting(E_ALL);

$dbHost = '127.0.0.1';
$dbName = 'u307020728_moardb';
$dbUser = 'u307020728_moardb';
$dbPass = 'Moardb@123';

$res = [
    "php_version" => phpversion(),
    "dbConnected" => false,
    "tables" => []
];

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $res["dbConnected"] = true;

    // Create Categories table if not exists
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `Categories` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL UNIQUE,
            `description` TEXT NULL,
            `icon` VARCHAR(100) DEFAULT 'Car',
            `image` TEXT NULL,
            `displayOrder` INT DEFAULT 0,
            `isActive` TINYINT DEFAULT 1,
            `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $t) {
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
        $res["tables"][$t] = $cnt;
    }
} catch (Exception $e) {
    $res["error"] = $e->getMessage();
}

echo json_encode($res);
