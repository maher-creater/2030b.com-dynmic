<?php
/**
 * 2030B-ABC · كن أعقل (Be More Sane) — Binance Pay purchase endpoint
 *
 * Endpoint : https://2030b.com/2030b-abc/php/index.php
 * Storage  : SQLite (./db/2030b-abc.sqlite, auto-created)
 * Pricing  : $30 USD per copy · paid in USDT/BNB via Binance Pay
 * Royalty  : 10% of every paid copy → Maher's Binance wallet
 * Target   : 4,000,000,000 rows (≈ $120B revenue · $12B royalty)
 * Author   : © 2026 Maher. All rights reserved.
 *
 * ─────────────────────────── HTTP CONTRACT ───────────────────────────
 *   POST ?action=create      body: {binance_user_id, email?, country?, currency?}
 *                            → creates order, returns Binance Pay checkout URL
 *   POST ?action=webhook     Binance Pay webhook (PAY / PAY_REFUND)
 *                            → updates order status, credits royalty
 *   GET  ?action=status&order_id=…           → JSON order status
 *   GET  ?action=stats                       → public totals (copies sold, $ raised)
 *   GET  ?action=stats&admin=…               → full dashboard (royalty owed, top buyers)
 *   GET  ?action=verify&order_id=…           → re-poll Binance Pay query API
 *   GET  ?action=royalty&admin=…             → list pending royalty batch
 *   POST ?action=royalty_payout&admin=…      → mark batch as paid (records tx hash)
 *   OPTIONS                                  → CORS preflight
 */

declare(strict_types=1);

/* ─────────────────────────── CONFIG ─────────────────────────── */
const BOOK_SLUG        = 'kun-a3qal';
const BOOK_EDITION     = 'ar-v1';
const PRICE_USD        = 30.00;
const ROYALTY_PCT      = 0.10;
const ROYALTY_USD      = 3.00;             // = PRICE_USD * ROYALTY_PCT
const TARGET_COPIES    = 4000000000;       // 4 × 10⁹

const DB_DIR           = __DIR__ . '/../db';
const DB_PATH          = __DIR__ . '/../db/2030b-abc.sqlite';
const SCHEMA_PATH      = __DIR__ . '/schema.sql';

// Binance Pay (Merchant API). Replace with real creds in production env.
const BN_API_BASE      = 'https://bpay.binanceapi.com';
const BN_ENDPOINT_ORDER = '/binancepay/openapi/v3/order';
const BN_ENDPOINT_QUERY = '/binancepay/openapi/v2/order/query';
const BN_MERCHANT_ID   = '2030B-MAHER-MERCHANT-ID';
const BN_API_KEY       = '2030B-BN-API-KEY-REPLACE-IN-ENV';
const BN_API_SECRET    = '2030B-BN-API-SECRET-REPLACE-IN-ENV';
const BN_WEBHOOK_KEY   = '2030B-BN-WEBHOOK-PUBKEY-REPLACE-IN-ENV';

// Where Maher's 10% lands.
const MAHER_PAYEE_ID   = 'maher-2030b-binance-payee';
const MAHER_WALLET_USDT = 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'; // placeholder TRC20

// Tokens — same two-tier model as views_url.
const CLIENT_TOKEN     = 'b2030-abc-public-7f1c92a83e6d4b05';
const ADMIN_TOKEN      = 'b2030-abc-admin-2c8a76e3b91f04d5e7a18cf6493b2057';

const SUCCESS_RETURN   = 'https://2030b.com/2030b-abc/thanks.html';
const CANCEL_RETURN    = 'https://2030b.com/2030b-abc/canceled.html';
const WEBHOOK_URL      = 'https://2030b.com/2030b-abc/php/index.php?action=webhook';

/* ─────────────────────────── CORS / HEADERS ─────────────────────────── */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-2030B-Token, X-2030B-Admin, BinancePay-Timestamp, BinancePay-Nonce, BinancePay-Signature, BinancePay-Certificate-SN');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ─────────────────────────── HELPERS ─────────────────────────── */
function out(array $p, int $code = 200): void {
    http_response_code($code);
    echo json_encode($p, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
function err(string $msg, int $code = 400): void {
    out(['ok' => false, 'error' => $msg, 'code' => $code], $code);
}
function now_ts(): int { return time(); }
function today(): string { return gmdate('Y-m-d'); }
function bucket(): string { return gmdate('Y-m'); }

function read_header(string $name): string {
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    if (!empty($_SERVER[$key])) return (string)$_SERVER[$key];
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) if (strcasecmp($k, $name) === 0) return (string)$v;
    }
    return '';
}

function presented_client_token(): string {
    if (!empty($_GET['token']))  return (string)$_GET['token'];
    if (!empty($_POST['token'])) return (string)$_POST['token'];
    $h = read_header('X-2030B-Token'); if ($h !== '') return $h;
    $a = read_header('Authorization');
    if (stripos($a, 'Bearer ') === 0) return trim(substr($a, 7));
    return '';
}
function presented_admin_token(): string {
    if (!empty($_GET['admin']))  return (string)$_GET['admin'];
    if (!empty($_POST['admin'])) return (string)$_POST['admin'];
    $h = read_header('X-2030B-Admin'); if ($h !== '') return $h;
    return '';
}
function client_ok(): bool {
    $t = presented_client_token();
    return $t !== '' && (hash_equals(CLIENT_TOKEN, $t) || hash_equals(ADMIN_TOKEN, $t));
}
function admin_ok(): bool {
    $t = presented_admin_token();
    return $t !== '' && hash_equals(ADMIN_TOKEN, $t);
}

function client_ip(): string {
    foreach (['HTTP_CF_CONNECTING_IP','HTTP_X_FORWARDED_FOR','HTTP_X_REAL_IP','REMOTE_ADDR'] as $h) {
        if (!empty($_SERVER[$h])) {
            $v = $_SERVER[$h];
            if (str_contains($v, ',')) $v = trim(explode(',', $v)[0]);
            return $v;
        }
    }
    return '0.0.0.0';
}
function ip_hash(string $ip): string {
    return substr(hash('sha256', 'b2030.' . gmdate('Ymd') . '|' . $ip), 0, 32);
}

function gen_uuid(): string {
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}
function gen_order_id(): string {
    // Binance Pay merchantTradeNo: alphanumeric, ≤32 chars.
    return 'B2030ABC' . strtoupper(bin2hex(random_bytes(10)));
}

function json_body(): array {
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') return [];
    $j = json_decode($raw, true);
    return is_array($j) ? $j : [];
}

function sanitize_bn_id(string $raw): string {
    $s = preg_replace('~[^a-zA-Z0-9_\-]+~', '', $raw) ?? '';
    return substr($s, 0, 64);
}
function sanitize_country(string $raw): string {
    $s = strtoupper(preg_replace('~[^a-zA-Z]+~', '', $raw) ?? '');
    return substr($s, 0, 3);
}
function sanitize_currency(string $raw): string {
    $s = strtoupper(preg_replace('~[^A-Z]+~', '', $raw) ?? '');
    if (!in_array($s, ['USDT','BNB','BUSD','FDUSD'], true)) $s = 'USDT';
    return $s;
}

/* ─────────────────────────── DB BOOT ─────────────────────────── */
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    if (!is_dir(DB_DIR)) @mkdir(DB_DIR, 0775, true);
    $fresh = !file_exists(DB_PATH);
    try {
        $pdo = new PDO('sqlite:' . DB_PATH);
    } catch (Throwable $e) {
        err('database unavailable', 500);
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $sql = @file_get_contents(SCHEMA_PATH);
    if ($sql) $pdo->exec($sql);
    if ($fresh) {
        $pdo->prepare('INSERT OR REPLACE INTO meta(k,v) VALUES(?,?)')
            ->execute(['installed_at', (string)now_ts()]);
        $pdo->prepare('INSERT OR REPLACE INTO meta(k,v) VALUES(?,?)')
            ->execute(['book', BOOK_SLUG . ':' . BOOK_EDITION]);
    }
    return $pdo;
}

/* ─────────────────────────── BINANCE PAY ─────────────────────────── */
function bn_sign(string $payload, string $timestamp, string $nonce): string {
    // HMAC-SHA512 of (timestamp + "\n" + nonce + "\n" + body + "\n") with BN_API_SECRET.
    $data = $timestamp . "\n" . $nonce . "\n" . $payload . "\n";
    return strtoupper(hash_hmac('sha512', $data, BN_API_SECRET));
}

function bn_call(string $endpoint, array $body): array {
    $payload   = json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $timestamp = (string)(int)(microtime(true) * 1000);
    $nonce     = strtoupper(bin2hex(random_bytes(16)));
    $sig       = bn_sign($payload, $timestamp, $nonce);

    $ch = curl_init(BN_API_BASE . $endpoint);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'BinancePay-Timestamp: ' . $timestamp,
            'BinancePay-Nonce: '     . $nonce,
            'BinancePay-Certificate-SN: ' . BN_API_KEY,
            'BinancePay-Signature: ' . $sig,
        ],
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $errm = curl_error($ch);
    curl_close($ch);

    if ($resp === false) return ['ok'=>false,'error'=>'curl: '.$errm,'http'=>$code];
    $json = json_decode($resp, true);
    return is_array($json) ? array_merge(['_http'=>$code], $json) : ['ok'=>false,'error'=>'bad json','http'=>$code,'raw'=>$resp];
}

function bn_create_order(array $tx): array {
    $body = [
        'env'              => ['terminalType' => 'WEB'],
        'merchantTradeNo'  => $tx['order_id'],
        'orderAmount'      => number_format($tx['amount_usd'], 2, '.', ''),
        'currency'         => $tx['currency'],
        'goods' => [
            'goodsType'        => '02',  // Virtual Goods
            'goodsCategory'    => 'D000',
            'referenceGoodsId' => BOOK_SLUG,
            'goodsName'        => 'كن أعقل · Be More Sane (eBook)',
            'goodsDetail'      => 'Book 1 of the Rushd Trilogy by Maher · 2030B Ecosystem',
        ],
        'buyer' => [
            'referenceBuyerId' => $tx['binance_user_id'],
        ],
        'returnUrl'  => SUCCESS_RETURN . '?order_id=' . urlencode($tx['order_id']),
        'cancelUrl'  => CANCEL_RETURN  . '?order_id=' . urlencode($tx['order_id']),
        'webhookUrl' => WEBHOOK_URL,
        'merchant'   => ['subMerchantId' => BN_MERCHANT_ID],
    ];
    return bn_call(BN_ENDPOINT_ORDER, $body);
}

function bn_query_order(string $orderId): array {
    return bn_call(BN_ENDPOINT_QUERY, ['merchantTradeNo' => $orderId]);
}

function bn_verify_webhook(string $body): bool {
    $ts    = read_header('BinancePay-Timestamp');
    $nonce = read_header('BinancePay-Nonce');
    $sig   = read_header('BinancePay-Signature');
    if ($ts === '' || $nonce === '' || $sig === '') return false;
    $data  = $ts . "\n" . $nonce . "\n" . $body . "\n";
    // Binance uses RSA on the webhook; here we accept either:
    //   - HMAC-SHA512 with BN_WEBHOOK_KEY (test mode), or
    //   - openssl_verify RSA-SHA256 with BN_WEBHOOK_KEY as PEM (prod).
    $hmac = strtoupper(hash_hmac('sha512', $data, BN_WEBHOOK_KEY));
    if (hash_equals($hmac, strtoupper($sig))) return true;
    if (function_exists('openssl_verify') && str_starts_with(BN_WEBHOOK_KEY, '-----BEGIN')) {
        $ok = @openssl_verify($data, base64_decode($sig), BN_WEBHOOK_KEY, OPENSSL_ALGO_SHA256);
        return $ok === 1;
    }
    return false;
}

/* ─────────────────────────── CORE ACTIONS ─────────────────────────── */
function action_create(): void {
    if (!client_ok()) err('invalid or missing client token', 401);

    $in = json_body();
    $bn = sanitize_bn_id((string)($in['binance_user_id'] ?? ''));
    if ($bn === '') err('binance_user_id required', 422);

    $email   = substr((string)($in['email'] ?? ''), 0, 160);
    $country = sanitize_country((string)($in['country'] ?? ''));
    $cur     = sanitize_currency((string)($in['currency'] ?? 'USDT'));

    $pdo = db();
    $orderId = gen_order_id();
    $now     = now_ts();

    $pdo->prepare('
        INSERT INTO transactions (
            order_id, binance_user_id, buyer_email, buyer_country,
            book_slug, book_edition, currency, amount_usd, royalty_pct, royalty_usd,
            status, ip_hash, user_agent, referer, bucket, created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ')->execute([
        $orderId, $bn, $email, $country,
        BOOK_SLUG, BOOK_EDITION, $cur, PRICE_USD, ROYALTY_PCT, ROYALTY_USD,
        'INITIAL', ip_hash(client_ip()),
        substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
        substr((string)($_SERVER['HTTP_REFERER'] ?? ''),    0, 255),
        bucket(), $now, $now,
    ]);

    // Upsert buyer
    $pdo->prepare('
        INSERT INTO buyers(binance_user_id, first_seen, last_seen, copies, spent_usd, royalty_usd, country, email_hash)
        VALUES(?,?,?,0,0,0,?,?)
        ON CONFLICT(binance_user_id) DO UPDATE SET last_seen=excluded.last_seen
    ')->execute([
        $bn, $now, $now, $country,
        $email === '' ? '' : substr(hash('sha256', strtolower(trim($email))), 0, 32)
    ]);

    $tx = [
        'order_id'        => $orderId,
        'binance_user_id' => $bn,
        'amount_usd'      => PRICE_USD,
        'currency'        => $cur,
    ];
    $bnResp = bn_create_order($tx);

    $checkout = $bnResp['data']['checkoutUrl']   ?? '';
    $prepay   = $bnResp['data']['prepayId']      ?? '';
    $deeplink = $bnResp['data']['deeplink']      ?? '';
    $qr       = $bnResp['data']['qrcodeLink']    ?? '';
    $status   = ($bnResp['status'] ?? '') === 'SUCCESS' ? 'PENDING' : 'ERROR';

    $pdo->prepare('UPDATE transactions SET prepay_id=?, status=?, bn_status=?, raw_payload=?, updated_at=? WHERE order_id=?')
        ->execute([$prepay, $status, (string)($bnResp['status'] ?? ''), json_encode($bnResp), now_ts(), $orderId]);

    out([
        'ok'           => $status !== 'ERROR',
        'order_id'     => $orderId,
        'amount_usd'   => PRICE_USD,
        'currency'     => $cur,
        'checkout_url' => $checkout,
        'qr_code'      => $qr,
        'deeplink'     => $deeplink,
        'expires_in'   => 3600,
        'status'       => $status,
        'ts'           => now_ts(),
    ]);
}

function action_webhook(): void {
    $raw = file_get_contents('php://input') ?: '';
    $sig_ok = bn_verify_webhook($raw);
    $j = json_decode($raw, true);
    if (!is_array($j)) err('bad json', 400);

    $bizid     = (string)($j['bizId']     ?? '');
    $biztype   = (string)($j['bizType']   ?? '');
    $bizstatus = (string)($j['bizStatus'] ?? '');
    $data      = is_string($j['data'] ?? null) ? json_decode($j['data'], true) : ($j['data'] ?? []);
    $orderId   = (string)($data['merchantTradeNo'] ?? '');

    $pdo = db();
    try {
        $pdo->prepare('INSERT INTO webhook_log(bizid,biztype,bizstatus,order_id,received_at,signature_ok,payload) VALUES(?,?,?,?,?,?,?)')
            ->execute([$bizid, $biztype, $bizstatus, $orderId, now_ts(), $sig_ok ? 1 : 0, $raw]);
    } catch (Throwable $e) {
        // duplicate bizid+biztype → already processed
        out(['ok' => true, 'duplicate' => true]);
    }

    if (!$sig_ok)         err('signature failed', 401);
    if ($orderId === '')  err('order missing', 422);

    $q = $pdo->prepare('SELECT * FROM transactions WHERE order_id=?');
    $q->execute([$orderId]);
    $tx = $q->fetch();
    if (!$tx) err('unknown order', 404);

    $newStatus = $tx['status'];
    $paidAt    = (int)$tx['paid_at'];

    if ($biztype === 'PAY' && $bizstatus === 'PAY_SUCCESS') {
        $newStatus = 'PAID';
        $paidAt    = now_ts();
        $payAmt    = (float)($data['transactionDetail']['totalFee'] ?? $tx['amount_usd']);
        $payCur    = (string)($data['transactionDetail']['currency'] ?? $tx['currency']);
        $fx        = $payAmt > 0 ? ((float)$tx['amount_usd'] / $payAmt) : 1.0;

        $pdo->prepare('
            UPDATE transactions
            SET status=?, bn_status=?, amount_crypto=?, fx_rate=?, currency=?, paid_at=?, updated_at=?, raw_payload=?
            WHERE order_id=?
        ')->execute(['PAID', $bizstatus, $payAmt, $fx, $payCur, $paidAt, now_ts(), $raw, $orderId]);

        // Lifetime aggregates
        $pdo->prepare('
            UPDATE buyers SET
                copies      = copies + 1,
                spent_usd   = spent_usd   + ?,
                royalty_usd = royalty_usd + ?,
                last_seen   = ?
            WHERE binance_user_id = ?
        ')->execute([PRICE_USD, ROYALTY_USD, now_ts(), $tx['binance_user_id']]);

        // Daily rollup
        $pdo->prepare('
            INSERT INTO daily_stats(day,copies,gross_usd,royalty_usd,unique_buyers,refunds)
            VALUES(?,1,?,?,1,0)
            ON CONFLICT(day) DO UPDATE SET
                copies      = copies      + 1,
                gross_usd   = gross_usd   + ?,
                royalty_usd = royalty_usd + ?
        ')->execute([today(), PRICE_USD, ROYALTY_USD, PRICE_USD, ROYALTY_USD]);

    } elseif ($biztype === 'PAY_REFUND' || $bizstatus === 'REFUND_SUCCESS') {
        $newStatus = 'REFUNDED';
        $pdo->prepare('UPDATE transactions SET status=?, bn_status=?, updated_at=?, raw_payload=? WHERE order_id=?')
            ->execute(['REFUNDED', $bizstatus, now_ts(), $raw, $orderId]);
        $pdo->prepare('UPDATE daily_stats SET refunds = refunds + 1 WHERE day=?')->execute([today()]);

    } elseif ($bizstatus === 'PAY_CLOSED' || $bizstatus === 'EXPIRED') {
        $newStatus = $bizstatus === 'EXPIRED' ? 'EXPIRED' : 'CANCELED';
        $pdo->prepare('UPDATE transactions SET status=?, bn_status=?, updated_at=?, raw_payload=? WHERE order_id=?')
            ->execute([$newStatus, $bizstatus, now_ts(), $raw, $orderId]);
    }

    out(['ok' => true, 'order_id' => $orderId, 'status' => $newStatus]);
}

function action_status(): void {
    $orderId = (string)($_GET['order_id'] ?? '');
    if ($orderId === '') err('order_id required', 422);
    $q = db()->prepare('SELECT order_id,status,bn_status,amount_usd,currency,paid_at,book_slug,binance_user_id,created_at,updated_at FROM transactions WHERE order_id=?');
    $q->execute([$orderId]);
    $r = $q->fetch();
    if (!$r) err('not found', 404);
    out(['ok' => true, 'order' => $r]);
}

function action_verify(): void {
    if (!client_ok()) err('invalid or missing client token', 401);
    $orderId = (string)($_GET['order_id'] ?? '');
    if ($orderId === '') err('order_id required', 422);
    $bn = bn_query_order($orderId);
    out(['ok' => true, 'order_id' => $orderId, 'binance' => $bn]);
}

function action_stats(): void {
    $pdo = db();
    $r = $pdo->query("
        SELECT
          COALESCE(SUM(CASE WHEN status='PAID' THEN 1 ELSE 0 END),0) AS copies,
          COALESCE(SUM(CASE WHEN status='PAID' THEN amount_usd  ELSE 0 END),0) AS gross_usd,
          COALESCE(SUM(CASE WHEN status='PAID' THEN royalty_usd ELSE 0 END),0) AS royalty_usd,
          COUNT(DISTINCT CASE WHEN status='PAID' THEN binance_user_id END) AS unique_buyers
        FROM transactions
    ")->fetch();

    $public = [
        'ok'              => true,
        'book'            => BOOK_SLUG,
        'edition'         => BOOK_EDITION,
        'price_usd'       => PRICE_USD,
        'royalty_pct'     => ROYALTY_PCT,
        'copies_sold'     => (int)($r['copies'] ?? 0),
        'gross_usd'       => (float)($r['gross_usd'] ?? 0),
        'unique_buyers'   => (int)($r['unique_buyers'] ?? 0),
        'target_copies'   => TARGET_COPIES,
        'target_gross_usd'=> TARGET_COPIES * PRICE_USD,
        'progress_pct'    => TARGET_COPIES > 0 ? round(100 * ((int)$r['copies']) / TARGET_COPIES, 6) : 0,
        'ts'              => now_ts(),
    ];

    if (admin_ok()) {
        $public['royalty_usd']   = (float)($r['royalty_usd'] ?? 0);
        $public['target_royalty']= TARGET_COPIES * ROYALTY_USD;
        $public['payee']         = MAHER_PAYEE_ID;
        $public['top_countries'] = $pdo->query("
            SELECT buyer_country AS country, COUNT(*) AS copies, SUM(amount_usd) AS gross
            FROM transactions WHERE status='PAID' GROUP BY buyer_country
            ORDER BY copies DESC LIMIT 50
        ")->fetchAll();
        $public['recent']        = $pdo->query("
            SELECT order_id, binance_user_id, buyer_country, amount_usd, paid_at
            FROM transactions WHERE status='PAID'
            ORDER BY paid_at DESC LIMIT 25
        ")->fetchAll();
    }
    out($public);
}

function action_royalty(): void {
    if (!admin_ok()) err('admin token required', 401);
    $pdo = db();
    $r = $pdo->query("
        SELECT COUNT(*) AS tx_count,
               COALESCE(SUM(amount_usd),0)  AS gross_usd,
               COALESCE(SUM(royalty_usd),0) AS royalty_usd
        FROM transactions
        WHERE status='PAID' AND royalty_paid=0
    ")->fetch();
    out([
        'ok' => true,
        'pending_batch' => $r,
        'payee'         => MAHER_PAYEE_ID,
        'wallet_usdt'   => MAHER_WALLET_USDT,
        'ts'            => now_ts(),
    ]);
}

function action_royalty_payout(): void {
    if (!admin_ok()) err('admin token required', 401);
    $in       = json_body();
    $hash     = (string)($in['tx_hash']  ?? '');
    $currency = sanitize_currency((string)($in['currency'] ?? 'USDT'));
    if ($hash === '') err('tx_hash required', 422);

    $pdo = db();
    $r = $pdo->query("
        SELECT COUNT(*) AS tx_count,
               COALESCE(SUM(amount_usd),0)  AS gross_usd,
               COALESCE(SUM(royalty_usd),0) AS royalty_usd,
               COALESCE(MIN(paid_at),0)     AS period_start,
               COALESCE(MAX(paid_at),0)     AS period_end
        FROM transactions WHERE status='PAID' AND royalty_paid=0
    ")->fetch();
    if ((int)$r['tx_count'] === 0) err('nothing to pay out', 422);

    $batchId = 'BATCH-' . strtoupper(bin2hex(random_bytes(8)));
    $pdo->beginTransaction();
    try {
        $pdo->prepare('
            INSERT INTO royalties (batch_id, period_start, period_end, tx_count, gross_usd, royalty_usd,
                                   payout_currency, payout_amount, payout_tx_hash, payout_status, created_at, settled_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        ')->execute([
            $batchId, (int)$r['period_start'], (int)$r['period_end'], (int)$r['tx_count'],
            (float)$r['gross_usd'], (float)$r['royalty_usd'],
            $currency, (float)$r['royalty_usd'], $hash, 'SENT', now_ts(), now_ts()
        ]);
        $pdo->exec("UPDATE transactions SET royalty_paid=1 WHERE status='PAID' AND royalty_paid=0");
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        err('payout write failed', 500);
    }
    out(['ok' => true, 'batch_id' => $batchId, 'amount_usd' => (float)$r['royalty_usd'], 'tx_hash' => $hash]);
}

/* ─────────────────────────── ROUTER ─────────────────────────── */
$action = (string)($_GET['action'] ?? 'banner');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($action) {
    case 'create':
        if ($method !== 'POST') err('POST required', 405);
        action_create(); break;
    case 'webhook':
        action_webhook(); break;
    case 'status':
        action_status(); break;
    case 'verify':
        action_verify(); break;
    case 'stats':
        action_stats(); break;
    case 'royalty':
        action_royalty(); break;
    case 'royalty_payout':
        if ($method !== 'POST') err('POST required', 405);
        action_royalty_payout(); break;
    default:
        out([
            'ok'       => true,
            'service'  => '2030B-ABC · كن أعقل · Binance Pay endpoint',
            'author'   => 'Maher © 2026',
            'book'     => BOOK_SLUG,
            'edition'  => BOOK_EDITION,
            'price_usd'=> PRICE_USD,
            'royalty'  => ROYALTY_PCT,
            'target'   => ['copies' => TARGET_COPIES, 'gross_usd' => TARGET_COPIES * PRICE_USD],
            'actions'  => ['create','webhook','status','verify','stats','royalty','royalty_payout'],
            'auth'     => ['client_token_header'=>'X-2030B-Token','admin_token_header'=>'X-2030B-Admin'],
            'ts'       => now_ts(),
        ]);
}
