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
    echo json_encode(['transactions' => []]);
    exit;
}

$storage = json_decode(file_get_contents($storagePath), true);


$userTransactions = array_filter($storage['transactions'], function($transaction) use ($userId) {
    return $transaction['user_id'] === $userId;
});


usort($userTransactions, function($a, $b) {
    return $b['timestamp'] - $a['timestamp'];
});


echo json_encode([
    'user_id' => $userId,
    'transactions' => array_values($userTransactions)
]);