<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}


$data = json_decode(file_get_contents('php://input'), true);


if (!isset($data['user_id']) || !isset($data['amount'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters']);
    exit;
}

$userId = $data['user_id'];
$amount = floatval($data['amount']);


if ($amount <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Amount must be positive']);
    exit;
}


$storagePath = '../data/storage.json';
if (!file_exists($storagePath)) {
    http_response_code(400);
    echo json_encode(['error' => 'User not found']);
    exit;
}

$storage = json_decode(file_get_contents($storagePath), true);


if (!isset($storage['users'][$userId])) {
    http_response_code(400);
    echo json_encode(['error' => 'User not found']);
    exit;
}


if ($storage['users'][$userId]['balance'] < $amount) {
    http_response_code(400);
    echo json_encode(['error' => 'Insufficient balance']);
    exit;
}


$storage['users'][$userId]['balance'] -= $amount;


$storage['transactions'][] = [
    'id' => uniqid(),
    'user_id' => $userId,
    'type' => 'withdraw',
    'amount' => $amount,
    'timestamp' => time()
];


file_put_contents($storagePath, json_encode($storage, JSON_PRETTY_PRINT));


echo json_encode([
    'status' => 'success',
    'message' => "Withdrew $amount successfully",
    'balance' => $storage['users'][$userId]['balance']
]);