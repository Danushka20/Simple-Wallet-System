<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');


if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user_id parameter']);
    exit;
}

$userId = $_GET['user_id'];


$storagePath = '../data/storage.json';
if (!file_exists($storagePath)) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
}

$storage = json_decode(file_get_contents($storagePath), true);


if (!isset($storage['users'][$userId])) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
}


echo json_encode([
    'user_id' => $userId,
    'balance' => $storage['users'][$userId]['balance']
]);