<?php
/**
 * API de Pagamento com Cartão de Débito via Mercado Pago
 * Rota: POST /api/pay/debit
 * 
 * Recebe: { token, payment_method_id, issuer_id, installments, description, payer: { email, identification } }
 * Retorna: { status, id } ou { error }
 */

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Método não permitido'], 405);
}

$body = getRequestBody();

// Validações
if (empty($body['token'])) {
    jsonResponse(['error' => 'Token do cartão é obrigatório'], 400);
}
if (empty($body['payer']['email'])) {
    jsonResponse(['error' => 'Email do pagador é obrigatório'], 400);
}

$cpf = preg_replace('/\D/', '', $body['payer']['identification']['number'] ?? '');

// Monta o payload
$payload = [
    'transaction_amount' => floatval(PRODUCT_PRICE),
    'token'              => $body['token'],
    'description'        => $body['description'] ?? PRODUCT_NAME,
    'installments'       => intval($body['installments'] ?? 1),
    'payment_method_id'  => $body['payment_method_id'],
    'issuer_id'          => $body['issuer_id'] ?? null,
    'payer'              => [
        'email'          => $body['payer']['email'],
        'identification' => [
            'type'   => 'CPF',
            'number' => $cpf,
        ],
    ],
];

// Remove issuer_id nulo
if ($payload['issuer_id'] === null) {
    unset($payload['issuer_id']);
}

$response = mercadoPagoRequest('/v1/payments', 'POST', $payload);

if (!empty($response['error']) || ($response['http_code'] >= 400)) {
    error_log('Mercado Pago Debit Error: ' . json_encode($response));
    $errorMsg = $response['message'] ?? $response['error'] ?? 'Erro ao processar pagamento';
    jsonResponse(['error' => $errorMsg, 'status' => 'rejected'], 422);
}

jsonResponse([
    'id'     => $response['id'],
    'status' => $response['status'],
]);
