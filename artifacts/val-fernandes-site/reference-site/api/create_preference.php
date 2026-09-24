<?php
/**
 * API para criar preferência de checkout (Mercado Pago Legacy Checkout)
 * Rota: POST /api/create_preference
 * 
 * Recebe: { description, price, quantity, payer: { name, email, cpf } }
 * Retorna: { init_point } — URL para redirecionar ao checkout do Mercado Pago
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

$name = trim($body['payer']['name'] ?? 'Cliente');
$email = trim($body['payer']['email'] ?? '');
$cpf = preg_replace('/\D/', '', $body['payer']['cpf'] ?? '');
$price = floatval($body['price'] ?? PRODUCT_PRICE);
$quantity = intval($body['quantity'] ?? 1);
$description = trim($body['description'] ?? PRODUCT_NAME);

if (empty($email)) {
    jsonResponse(['error' => 'Email do pagador é obrigatório'], 400);
}

$payload = [
    'items' => [
        [
            'id'          => 'destrave-emocional-01',
            'title'       => $description,
            'description' => 'Imersão Destrave Emocional com Val Fernandes',
            'quantity'    => $quantity,
            'currency_id' => PRODUCT_CURRENCY,
            'unit_price'  => $price,
        ],
    ],
    'payer' => [
        'name'           => explode(' ', $name)[0],
        'surname'        => implode(' ', array_slice(explode(' ', $name), 1)) ?: 'Sobrenome',
        'email'          => $email,
        'identification' => [
            'type'   => 'CPF',
            'number' => $cpf,
        ],
    ],
    'back_urls' => [
        'success' => SITE_URL . '/sucesso?status=approved&payment_type=checkout',
        'failure' => SITE_URL . '/processo-terapeutico?payment=failure',
        'pending' => SITE_URL . '/processo-terapeutico?payment=pending',
    ],
    'auto_return'         => 'approved',
    'statement_descriptor' => 'Val Fernandes',
];

$response = mercadoPagoRequest('/checkout/preferences', 'POST', $payload);

if (!empty($response['error']) || ($response['http_code'] >= 400)) {
    error_log('Mercado Pago Preference Error: ' . json_encode($response));
    $errorMsg = $response['message'] ?? $response['error'] ?? 'Erro ao criar preferência';
    jsonResponse(['error' => $errorMsg], 422);
}

jsonResponse([
    'init_point'    => $response['init_point'],
    'sandbox_init'  => $response['sandbox_init_point'] ?? null,
    'preference_id' => $response['id'],
]);
