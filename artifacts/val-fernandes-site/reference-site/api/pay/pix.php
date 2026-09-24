<?php
/**
 * API de Pagamento PIX via Mercado Pago
 * Rota: POST /api/pay/pix
 * 
 * Recebe: { description, price, payer: { email, cpf, name } }
 * Retorna: { id, qr_code, qr_code_base64, status }
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

// Validações básicas
if (empty($body['payer']['email']) || empty($body['payer']['cpf'])) {
    jsonResponse(['error' => 'Email e CPF são obrigatórios'], 400);
}

// Limpar CPF (remover pontuação)
$cpf = preg_replace('/\D/', '', $body['payer']['cpf'] ?? '');
$email = trim($body['payer']['email'] ?? '');
$name = trim($body['payer']['name'] ?? 'Cliente');
$price = floatval($body['price'] ?? PRODUCT_PRICE);
$description = trim($body['description'] ?? PRODUCT_NAME);

// Monta o payload para Mercado Pago
$payload = [
    'transaction_amount' => $price,
    'description'        => $description,
    'payment_method_id'  => 'pix',
    'payer'              => [
        'email'          => $email,
        'first_name'     => explode(' ', $name)[0],
        'last_name'      => implode(' ', array_slice(explode(' ', $name), 1)) ?: 'Sobrenome',
        'identification' => [
            'type'   => 'CPF',
            'number' => $cpf,
        ],
    ],
];

$response = mercadoPagoRequest('/v1/payments', 'POST', $payload);

if (!empty($response['error']) || ($response['http_code'] >= 400)) {
    error_log('Mercado Pago PIX Error: ' . json_encode($response));
    $errorMsg = $response['message'] ?? $response['error'] ?? 'Erro ao gerar PIX';
    jsonResponse(['error' => $errorMsg], 422);
}

// Extrai os dados do QR Code
$pixData = $response['point_of_interaction']['transaction_data'] ?? null;

if (!$pixData) {
    jsonResponse(['error' => 'Não foi possível gerar o QR Code PIX'], 500);
}

jsonResponse([
    'id'             => $response['id'],
    'qr_code'        => $pixData['qr_code'],
    'qr_code_base64' => $pixData['qr_code_base64'],
    'status'         => $response['status'],
]);
