<?php
/**
 * Configurações centrais do backend de pagamento.
 * 
 * ⚠️ IMPORTANTE: Substitua o MERCADOPAGO_ACCESS_TOKEN pelo seu token real.
 * Obtenha em: https://www.mercadopago.com.br/developers/panel/credentials
 */

// Mercado Pago
define('MERCADOPAGO_ACCESS_TOKEN', 'APP_USR-COLE_SEU_ACCESS_TOKEN_AQUI');
define('MERCADOPAGO_PUBLIC_KEY', 'APP_USR-bc529963-3ac1-4faa-bddf-39d36a0817a3');

// Produto
define('PRODUCT_NAME', 'Imersão Destrave Emocional');
define('PRODUCT_PRICE', 147);
define('PRODUCT_CURRENCY', 'BRL');

// URL base do site (sem barra no final)
define('SITE_URL', 'https://valfernandes.com.br');

// Email de notificação admin
define('ADMIN_EMAIL', 'destravemocional@gmail.com');

// Headers para respostas JSON da API
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Pega o body JSON da requisição
function getRequestBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

// Faz uma requisição HTTP para a API do Mercado Pago
function mercadoPagoRequest($endpoint, $method = 'GET', $body = null) {
    $ch = curl_init('https://api.mercadopago.com' . $endpoint);
    
    $headers = [
        'Authorization: Bearer ' . MERCADOPAGO_ACCESS_TOKEN,
        'Content-Type: application/json',
        'X-Idempotency-Key: ' . uniqid('mp_', true),
    ];
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['error' => 'Erro de conexão: ' . $error, 'http_code' => 0];
    }
    
    $decoded = json_decode($response, true);
    $decoded['http_code'] = $httpCode;
    return $decoded;
}
