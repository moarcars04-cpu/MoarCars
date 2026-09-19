<?php
header("Content-Type: application/json; charset=UTF-8");
echo json_encode([
    "status" => "ok",
    "message" => "Direct PHP execution is working!",
    "php_version" => phpversion()
]);
