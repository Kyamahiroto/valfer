<?php
/**
 * API para verificar status de pagamento (polling)
 * Rota: GET /api/status?id=PAYMENT_ID
 * 
 * Retorna: { status } — valores possíveis: pending, approved, rejected, etc.
 */

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config.php';

$paymentId = $_GET['id'] ?? '';

if (empty($paymentId) || !is_numeric($paymentId)) {
    jsonResponse(['error' => 'ID de pagamento inválido'], 400);
}

$response = mercadoPagoRequest('/v1/payments/' . intval($paymentId));

if (!empty($response['error']) || ($response['http_code'] >= 400)) {
    error_log('Mercado Pago Status Error: ' . json_encode($response));
    jsonResponse(['error' => 'Pagamento não encontrado', 'status' => 'unknown'], 404);
}

jsonResponse([
    'id'     => $response['id'],
    'status' => $response['status'],
]);
