<?php
// ----------------------------------------------------------------------
// Moar Cars - Ultra-Fast Production Backend API for Hostinger
// ----------------------------------------------------------------------

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Fast Database Connection (Persistent PDO)
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'u307020728_moardb';
$dbUser = getenv('DB_USER') ?: 'u307020728_moardb';
$dbPass = getenv('DB_PASSWORD') ?: 'Moardb@123';

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_PERSISTENT => true,
        PDO::ATTR_TIMEOUT => 3,
    ]);
} catch (Exception $e) {
    $dbError = $e->getMessage();
}

// Helper to auto-create schema only when needed
function ensureTablesExist($pdo) {
    static $checked = false;
    if ($checked || !$pdo) return;
    $checked = true;

    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS Cars (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                detail TEXT NOT NULL,
                price VARCHAR(100) NOT NULL,
                tag VARCHAR(100) DEFAULT 'Everyday',
                imagePosition VARCHAR(50) DEFAULT 'center',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS Bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pickup VARCHAR(255) NOT NULL,
                startDate VARCHAR(100) NOT NULL,
                endDate VARCHAR(100) NOT NULL,
                carName VARCHAR(255) DEFAULT 'General Search Inquiry',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS Admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS AdminOtps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                otp VARCHAR(10) NOT NULL,
                expiresAt BIGINT NOT NULL,
                attempts INT DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX (email)
            );
        ");

        $carCount = $pdo->query("SELECT COUNT(*) FROM Cars")->fetchColumn();
        if ($carCount == 0) {
            $stmt = $pdo->prepare("INSERT INTO Cars (name, detail, price, tag, imagePosition) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute(["City Hatchbacks", "Smart, efficient and easy to park", "₹1,699", "Everyday", "left"]);
            $stmt->execute(["Executive Sedans", "A smoother way to go further", "₹2,199", "Comfort", "center"]);
            $stmt->execute(["Adventure SUVs", "More room for the road ahead", "₹2,499", "Popular", "right"]);
        }

        $adminCount = $pdo->query("SELECT COUNT(*) FROM Admins")->fetchColumn();
        if ($adminCount == 0) {
            $stmt = $pdo->prepare("INSERT INTO Admins (username, password) VALUES (?, ?)");
            $stmt->execute(["admin", "adminpassword"]);
        }
    } catch (Exception $e) {}
}

// 2. High-Performance Gmail SMTP Mailer with low-latency sockets
function sendGmailOtp($toEmail, $otp) {
    $smtpHost = "ssl://smtp.gmail.com";
    $smtpPort = 465;
    $username = getenv('ADMIN_EMAIL') ?: 'moarcars04@gmail.com';
    $rawPass = getenv('ADMIN_EMAIL_APP_PASSWORD') ?: 'giykjehrkoeeoqzc';
    $password = str_replace(' ', '', $rawPass);

    $socket = @fsockopen($smtpHost, $smtpPort, $errno, $errstr, 4);
    if (!$socket) {
        $subject = "Your Admin Login Code: $otp";
        $msg = "Your login verification code is: $otp\n\nValid for 10 minutes.";
        return @mail($toEmail, $subject, $msg, "From: $username\r\nReply-To: $username\r\n");
    }

    // Set socket stream timeout to 3s to prevent hangs
    stream_set_timeout($socket, 3);

    $read = function($sock) {
        $data = "";
        while ($line = fgets($sock, 512)) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $data;
    };

    $read($socket);

    fputs($socket, "EHLO localhost\r\n");
    $read($socket);

    fputs($socket, "AUTH LOGIN\r\n");
    $read($socket);

    fputs($socket, base64_encode($username) . "\r\n");
    $read($socket);

    fputs($socket, base64_encode($password) . "\r\n");
    $authRes = $read($socket);
    if (strpos($authRes, "235") === false) {
        fclose($socket);
        return false;
    }

    fputs($socket, "MAIL FROM: <$username>\r\n");
    $read($socket);

    fputs($socket, "RCPT TO: <$toEmail>\r\n");
    $read($socket);

    fputs($socket, "DATA\r\n");
    $read($socket);

    $subject = "=?UTF-8?B?" . base64_encode("🔑 Your Admin Login Code: $otp") . "?=";
    $headers = "From: Moar Cars Admin <$username>\r\n"
             . "To: <$toEmail>\r\n"
             . "MIME-Version: 1.0\r\n"
             . "Content-Type: text/html; charset=UTF-8\r\n"
             . "Subject: $subject\r\n";

    $body = '<div style="font-family: Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto;">'
          . '<div style="text-align: center; margin-bottom: 20px;">'
          . '<h1 style="color: #48cae4; margin: 0; font-size: 24px;">Moar Cars Rental</h1>'
          . '<p style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Admin Control Panel</p>'
          . '</div>'
          . '<div style="background-color: #1c2541; padding: 25px; border-radius: 8px; border: 1px solid #3a506b; text-align: center;">'
          . '<p style="font-size: 14px; color: #cbd5e1; margin-bottom: 15px;">Your one-time verification code for admin login is:</p>'
          . '<div style="background: linear-gradient(135deg, #00b4d8, #0077b6); color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 20px; border-radius: 8px; display: inline-block; margin: 10px 0;">' . $otp . '</div>'
          . '<p style="font-size: 12px; color: #94a3b8; margin-top: 15px;">⏱️ This code is valid for <strong>10 minutes</strong>.</p>'
          . '</div>'
          . '<p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 20px;">If you did not request this login code, please secure your account immediately.</p>'
          . '</div>';

    fputs($socket, "$headers\r\n$body\r\n.\r\n");
    $read($socket);

    fputs($socket, "QUIT\r\n");
    fclose($socket);

    return true;
}

// 3. Fast Routing
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$route = preg_replace('#^/api/?#', '', $uri);
$route = trim($route, '/');

// Health Check: GET /api/health or /api
if ($route === 'health' || $route === '') {
    echo json_encode(["success" => true, "message" => "Moar Cars Production API is online", "time" => date('c')]);
    exit();
}

// 1. Send OTP: POST /api/admin/send-otp
if ($route === 'admin/send-otp' && $method === 'POST') {
    $email = strtolower(trim($input['email'] ?? 'moarcars04@gmail.com'));
    $authorizedEmail = strtolower(trim(getenv('ADMIN_EMAIL') ?: 'moarcars04@gmail.com'));

    if ($email !== $authorizedEmail) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Unauthorized admin email address."]);
        exit();
    }

    $otp = (string)rand(100000, 999999);
    $expiresAt = (time() + (10 * 60)) * 1000; // ms

    if (isset($pdo)) {
        try {
            $stmt = $pdo->prepare("DELETE FROM AdminOtps WHERE email = ?");
            $stmt->execute([$email]);

            $stmt = $pdo->prepare("INSERT INTO AdminOtps (email, otp, expiresAt, attempts) VALUES (?, ?, ?, 0)");
            $stmt->execute([$email, $otp, $expiresAt]);
        } catch (Exception $e) {
            // Lazy table creation fallback if table was missing
            ensureTablesExist($pdo);
            $stmt = $pdo->prepare("INSERT INTO AdminOtps (email, otp, expiresAt, attempts) VALUES (?, ?, ?, 0)");
            $stmt->execute([$email, $otp, $expiresAt]);
        }
    }

    $sent = sendGmailOtp($email, $otp);
    if ($sent) {
        echo json_encode(["success" => true, "message" => "Verification code sent to $email"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to dispatch email. Check SMTP settings."]);
    }
    exit();
}

// 2. Verify OTP: POST /api/admin/verify-otp
if ($route === 'admin/verify-otp' && $method === 'POST') {
    $email = strtolower(trim($input['email'] ?? 'moarcars04@gmail.com'));
    $otp = trim((string)($input['otp'] ?? ''));

    if (empty($otp)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Please enter the 6-digit OTP code."]);
        exit();
    }

    if (!isset($pdo)) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database connection unavailable."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM AdminOtps WHERE email = ? ORDER BY id DESC LIMIT 1");
        $stmt->execute([$email]);
        $record = $stmt->fetch();
    } catch (Exception $e) {
        ensureTablesExist($pdo);
        $record = null;
    }

    if (!$record) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "No active verification code found. Please request a new OTP."]);
        exit();
    }

    $nowMs = time() * 1000;
    if ($nowMs > (int)$record['expiresAt']) {
        $pdo->prepare("DELETE FROM AdminOtps WHERE email = ?")->execute([$email]);
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "The verification code has expired. Please request a new one."]);
        exit();
    }

    if ($record['otp'] !== $otp) {
        $attempts = (int)$record['attempts'] + 1;
        if ($attempts >= 5) {
            $pdo->prepare("DELETE FROM AdminOtps WHERE email = ?")->execute([$email]);
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Too many failed attempts. Please request a new OTP."]);
            exit();
        }
        $pdo->prepare("UPDATE AdminOtps SET attempts = ? WHERE id = ?")->execute([$attempts, $record['id']]);
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid code. " . (5 - $attempts) . " attempt(s) remaining."]);
        exit();
    }

    // Success!
    $pdo->prepare("DELETE FROM AdminOtps WHERE email = ?")->execute([$email]);
    echo json_encode(["success" => true, "message" => "Admin verification successful!", "username" => $email]);
    exit();
}

// 3. Password Login: POST /api/admin/login
if ($route === 'admin/login' && $method === 'POST') {
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Username and password required."]);
        exit();
    }

    if (!isset($pdo)) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database connection unavailable."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM Admins WHERE username = ? AND password = ?");
        $stmt->execute([$username, $password]);
        $admin = $stmt->fetch();
    } catch (Exception $e) {
        ensureTablesExist($pdo);
        $admin = null;
    }

    if (!$admin) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid username or password."]);
        exit();
    }

    echo json_encode(["success" => true, "message" => "Login successful", "username" => $admin['username']]);
    exit();
}

// 4. Get Fleet: GET /api/cars
if ($route === 'cars' && $method === 'GET') {
    if (!isset($pdo)) {
        echo json_encode(["success" => true, "data" => []]);
        exit();
    }
    try {
        $cars = $pdo->query("SELECT * FROM Cars")->fetchAll();
    } catch (Exception $e) {
        ensureTablesExist($pdo);
        $cars = $pdo->query("SELECT * FROM Cars")->fetchAll();
    }
    echo json_encode(["success" => true, "data" => $cars]);
    exit();
}

// 5. Add Booking: POST /api/bookings
if ($route === 'bookings' && $method === 'POST') {
    $pickup = trim($input['pickup'] ?? '');
    $startDate = trim($input['startDate'] ?? '');
    $endDate = trim($input['endDate'] ?? '');
    $carName = trim($input['carName'] ?? 'General Search Inquiry');

    if (empty($pickup) || empty($startDate) || empty($endDate)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Please fill all booking details (pickup, start date, end date)."]);
        exit();
    }

    if (isset($pdo)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO Bookings (pickup, startDate, endDate, carName) VALUES (?, ?, ?, ?)");
            $stmt->execute([$pickup, $startDate, $endDate, $carName]);
            $id = $pdo->lastInsertId();
        } catch (Exception $e) {
            ensureTablesExist($pdo);
            $stmt = $pdo->prepare("INSERT INTO Bookings (pickup, startDate, endDate, carName) VALUES (?, ?, ?, ?)");
            $stmt->execute([$pickup, $startDate, $endDate, $carName]);
            $id = $pdo->lastInsertId();
        }
        echo json_encode(["success" => true, "message" => "Booking reservation saved successfully!", "data" => ["id" => $id, "pickup" => $pickup, "startDate" => $startDate, "endDate" => $endDate, "carName" => $carName]]);
    } else {
        echo json_encode(["success" => true, "message" => "Booking reservation recorded."]);
    }
    exit();
}

// 6. Get Admin Bookings: GET /api/admin/bookings
if ($route === 'admin/bookings' && $method === 'GET') {
    if (!isset($pdo)) {
        echo json_encode(["success" => true, "data" => []]);
        exit();
    }
    try {
        $bookings = $pdo->query("SELECT * FROM Bookings ORDER BY id DESC")->fetchAll();
    } catch (Exception $e) {
        ensureTablesExist($pdo);
        $bookings = [];
    }
    echo json_encode(["success" => true, "data" => $bookings]);
    exit();
}

// 7. Add Car: POST /api/admin/cars
if ($route === 'admin/cars' && $method === 'POST') {
    $name = trim($input['name'] ?? '');
    $detail = trim($input['detail'] ?? '');
    $price = trim($input['price'] ?? '');
    $tag = trim($input['tag'] ?? 'Everyday');
    $imagePosition = trim($input['imagePosition'] ?? 'center');

    if (empty($name) || empty($detail) || empty($price)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Name, detail, and price are required."]);
        exit();
    }

    if (isset($pdo)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO Cars (name, detail, price, tag, imagePosition) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $detail, $price, $tag, $imagePosition]);
            $id = $pdo->lastInsertId();
        } catch (Exception $e) {
            ensureTablesExist($pdo);
            $stmt = $pdo->prepare("INSERT INTO Cars (name, detail, price, tag, imagePosition) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $detail, $price, $tag, $imagePosition]);
            $id = $pdo->lastInsertId();
        }
        echo json_encode(["success" => true, "message" => "Car added successfully!", "data" => ["id" => $id, "name" => $name, "detail" => $detail, "price" => $price, "tag" => $tag, "imagePosition" => $imagePosition]]);
    } else {
        echo json_encode(["success" => true, "message" => "Car added."]);
    }
    exit();
}

// 8. Delete Car: DELETE /api/admin/cars/{id}
if (preg_match('#^admin/cars/([0-9]+)$#', $route, $matches) && $method === 'DELETE') {
    $carId = (int)$matches[1];
    if (isset($pdo)) {
        $stmt = $pdo->prepare("DELETE FROM Cars WHERE id = ?");
        $stmt->execute([$carId]);
    }
    echo json_encode(["success" => true, "message" => "Car deleted successfully!"]);
    exit();
}

// Fallback 404
http_response_code(404);
echo json_encode(["success" => false, "message" => "Endpoint not found: $route"]);
exit();
