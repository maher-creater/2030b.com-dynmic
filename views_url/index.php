<?php
/**
 * 2030B Entry-Point — Views Counter API
 *
 * Endpoint:  https://2030b.com/views_url/index.php
 * Storage :  SQLite (file: ./views.sqlite, auto-created on first hit)
 * Author  :  © 2026 Maher. All rights reserved.
 *
 * ─────────────────────────────────────────────────────────────────────
 *  HTTP CONTRACT
 * ─────────────────────────────────────────────────────────────────────
 *  GET  /views_url/                          → JSON, all pages totals
 *  GET  /views_url/?page=<slug>              → JSON, one page total (no increment)
 *  POST /views_url/?page=<slug>&sid=<uuid>   → JSON, increments + returns total
 *  GET  /views_url/?page=<slug>&hit=1        → JSON, GET-fallback increment
 *  GET  /views_url/?stats=1                  → JSON, leaderboard (top pages)
 *  GET  /views_url/?stats=1&page=<slug>      → JSON, daily timeseries for page
 *  OPTIONS                                   → CORS preflight (204)
 *
 *  Response shape (success):
 *    {
 *      "ok"       : true,
 *      "page"     : "home",
 *      "views"    : 12345,        // total all-time hits
 *      "uniques"  : 4321,         // distinct sids
 *      "today"    : 56,           // hits today (UTC)
 *      "bumped"   : true,         // true on POST / hit=1
 *      "ts"       : 1745000000
 *    }
 *
 *  Response shape (error):
 *    { "ok": false, "error": "<message>", "code": <http_status> }
 *
 * ─────────────────────────────────────────────────────────────────────
 *  SECURITY / ABUSE
 * ─────────────────────────────────────────────────────────────────────
 *  - Page slug is sanitised to [a-z0-9-_/]{1,80}.
 *  - One increment per (page, sid) per 30 s minimum cool-down (anti-spam).
 *  - One increment per (page, ip) per 5 s hard cool-down.
 *  - IP is hashed with a daily salt before storage.
 *  - User-agents flagged as bots are counted in a separate column.
 *  - CORS allows any origin for GET; POST allowed from any origin (this is
 *    a public counter — no PII is stored).
 *
 * ─────────────────────────────────────────────────────────────────────
 *  SCHEMA
 * ─────────────────────────────────────────────────────────────────────
 *  pages(slug TEXT PK, total INT, uniques INT, today INT, today_date TEXT,
 *        bots INT, first_seen INT, last_seen INT)
 *  hits (id INT PK, slug TEXT, sid TEXT, ip_hash TEXT, ua TEXT, ref TEXT,
 *        is_bot INT, ts INT, day TEXT)
 *  daily(slug TEXT, day TEXT, hits INT, uniques INT, PRIMARY KEY(slug,day))
 *  meta (k TEXT PK, v TEXT)
 */

declare(strict_types=1);

/* ──────────────────── CONFIG ──────────────────── */
const DB_PATH        = __DIR__ . '/views.sqlite';
const SID_COOLDOWN   = 30;     // seconds between increments per (page,sid)
const IP_COOLDOWN    = 5;      // seconds between increments per (page,ip)
const SLUG_MAX_LEN   = 80;
const TOP_LIMIT      = 50;
const TIMESERIES_DAYS = 90;

/*
 * ──────────────────── TOKENS ────────────────────
 * Two-tier token model:
 *
 *  1. CLIENT_TOKEN  — public, embedded in js/views.js. Marks a hit as coming
 *     from the legitimate 2030B entry-point bundle. Required on POST /
 *     ?hit=1 increments (read-only GETs are still anonymous). Rotate by
 *     editing both this file and js/views.js together.
 *
 *  2. ADMIN_TOKEN   — private. Required to read ?stats=1 endpoints with full
 *     timeseries / leaderboards. Anonymous reads only get the per-page
 *     total (no leaderboard, no daily series).
 *
 * Tokens may be supplied via:
 *     - query string ?token=...       (matches CLIENT_TOKEN)
 *     - query string ?admin=...       (matches ADMIN_TOKEN)
 *     - header     X-2030B-Token:     (matches CLIENT_TOKEN)
 *     - header     X-2030B-Admin:     (matches ADMIN_TOKEN)
 *     - header     Authorization: Bearer <CLIENT_TOKEN>
 */
const CLIENT_TOKEN   = 'b2030-public-9f3c2e7a4d1b8056';
const ADMIN_TOKEN    = 'b2030-admin-3e7c91a85f4d2b0c1a6e8d4f72b09c5e';
const REQUIRE_TOKEN  = true;   // if false, hits are accepted without a client token (legacy)

/* ──────────────────── CORS / HEADERS ──────────────────── */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Max-Age: 86400');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ──────────────────── HELPERS ──────────────────── */
function out_json(array $payload, int $code = 200): void {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function out_err(string $msg, int $code = 400): void {
    out_json(['ok' => false, 'error' => $msg, 'code' => $code], $code);
}

function clean_slug(?string $raw): string {
    if ($raw === null) return 'home';
    $s = strtolower(trim($raw));
    $s = preg_replace('~[^a-z0-9_\-/]+~', '-', $s) ?? '';
    $s = trim($s, '-/');
    if ($s === '' || $s === 'index' || $s === 'index.html') $s = 'home';
    if (strlen($s) > SLUG_MAX_LEN) $s = substr($s, 0, SLUG_MAX_LEN);
    return $s;
}

function client_ip(): string {
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'] as $h) {
        if (!empty($_SERVER[$h])) {
            $v = $_SERVER[$h];
            if (str_contains($v, ',')) $v = trim(explode(',', $v)[0]);
            return $v;
        }
    }
    return '0.0.0.0';
}

function daily_salt(): string {
    return 'b2030.' . gmdate('Ymd');
}

function ip_hash(string $ip): string {
    return substr(hash('sha256', daily_salt() . '|' . $ip), 0, 32);
}

function is_bot(string $ua): bool {
    if ($ua === '') return true;
    $needles = ['bot', 'spider', 'crawl', 'slurp', 'curl/', 'wget/', 'httpclient',
                'python-requests', 'go-http-client', 'headlesschrome', 'phantomjs',
                'facebookexternalhit', 'whatsapp', 'embedly', 'preview', 'lighthouse'];
    $lc = strtolower($ua);
    foreach ($needles as $n) if (str_contains($lc, $n)) return true;
    return false;
}

function clean_sid(?string $raw): string {
    if ($raw === null) return '';
    $s = preg_replace('~[^a-zA-Z0-9_\-]+~', '', $raw) ?? '';
    return substr($s, 0, 64);
}

function now_ts(): int { return time(); }
function today_str(): string { return gmdate('Y-m-d'); }

/* ──────────────────── TOKEN HELPERS ──────────────────── */
function read_header(string $name): string {
    // Apache: HTTP_X_2030B_TOKEN ; CGI variants
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    if (!empty($_SERVER[$key])) return (string)$_SERVER[$key];
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strcasecmp($k, $name) === 0) return (string)$v;
        }
    }
    return '';
}

function presented_client_token(): string {
    if (!empty($_GET['token']))  return (string)$_GET['token'];
    if (!empty($_POST['token'])) return (string)$_POST['token'];
    $h = read_header('X-2030B-Token');
    if ($h !== '') return $h;
    $auth = read_header('Authorization');
    if (stripos($auth, 'Bearer ') === 0) return trim(substr($auth, 7));
    return '';
}

function presented_admin_token(): string {
    if (!empty($_GET['admin']))  return (string)$_GET['admin'];
    if (!empty($_POST['admin'])) return (string)$_POST['admin'];
    $h = read_header('X-2030B-Admin');
    if ($h !== '') return $h;
    return '';
}

function client_token_ok(): bool {
    $t = presented_client_token();
    if ($t === '') return false;
    return hash_equals(CLIENT_TOKEN, $t) || hash_equals(ADMIN_TOKEN, $t);
}

function admin_token_ok(): bool {
    $t = presented_admin_token();
    if ($t === '') return false;
    return hash_equals(ADMIN_TOKEN, $t);
}

/* ──────────────────── DB BOOT ──────────────────── */
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;

    $first = !file_exists(DB_PATH);
    try {
        $pdo = new PDO('sqlite:' . DB_PATH);
    } catch (Throwable $e) {
        out_err('database unavailable', 500);
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA synchronous  = NORMAL');
    $pdo->exec('PRAGMA temp_store   = MEMORY');
    $pdo->exec('PRAGMA busy_timeout = 4000');

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS pages (
            slug         TEXT PRIMARY KEY,
            total        INTEGER NOT NULL DEFAULT 0,
            uniques      INTEGER NOT NULL DEFAULT 0,
            today        INTEGER NOT NULL DEFAULT 0,
            today_date   TEXT    NOT NULL DEFAULT '',
            bots         INTEGER NOT NULL DEFAULT 0,
            first_seen   INTEGER NOT NULL DEFAULT 0,
            last_seen    INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS hits (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            slug    TEXT    NOT NULL,
            sid     TEXT    NOT NULL DEFAULT '',
            ip_hash TEXT    NOT NULL DEFAULT '',
            ua      TEXT    NOT NULL DEFAULT '',
            ref     TEXT    NOT NULL DEFAULT '',
            is_bot  INTEGER NOT NULL DEFAULT 0,
            ts      INTEGER NOT NULL,
            day     TEXT    NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_hits_slug_ts  ON hits(slug, ts);
        CREATE INDEX IF NOT EXISTS idx_hits_slug_sid ON hits(slug, sid, ts);
        CREATE INDEX IF NOT EXISTS idx_hits_slug_ip  ON hits(slug, ip_hash, ts);
        CREATE INDEX IF NOT EXISTS idx_hits_day      ON hits(day);

        CREATE TABLE IF NOT EXISTS daily (
            slug    TEXT NOT NULL,
            day     TEXT NOT NULL,
            hits    INTEGER NOT NULL DEFAULT 0,
            uniques INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY(slug, day)
        );
        CREATE TABLE IF NOT EXISTS meta (
            k TEXT PRIMARY KEY,
            v TEXT
        );
    ");

    if ($first) {
        $pdo->prepare('INSERT OR REPLACE INTO meta(k,v) VALUES(?,?)')
            ->execute(['installed_at', (string) now_ts()]);
        $pdo->prepare('INSERT OR REPLACE INTO meta(k,v) VALUES(?,?)')
            ->execute(['author', 'Maher © 2026 · 2030B Entry Point']);
    }
    return $pdo;
}

/* ──────────────────── CORE ──────────────────── */
function ensure_page_row(PDO $pdo, string $slug): void {
    $pdo->prepare('
        INSERT INTO pages(slug,total,uniques,today,today_date,bots,first_seen,last_seen)
        VALUES(?,0,0,0,?,0,?,?)
        ON CONFLICT(slug) DO NOTHING
    ')->execute([$slug, today_str(), now_ts(), now_ts()]);
}

function rollover_today_if_needed(PDO $pdo, string $slug): void {
    $row = $pdo->prepare('SELECT today_date FROM pages WHERE slug=?');
    $row->execute([$slug]);
    $r = $row->fetch();
    if ($r && $r['today_date'] !== today_str()) {
        $pdo->prepare('UPDATE pages SET today=0, today_date=? WHERE slug=?')
            ->execute([today_str(), $slug]);
    }
}

function under_cooldown(PDO $pdo, string $slug, string $sid, string $iph): bool {
    $now = now_ts();
    if ($sid !== '') {
        $q = $pdo->prepare('SELECT ts FROM hits WHERE slug=? AND sid=? ORDER BY ts DESC LIMIT 1');
        $q->execute([$slug, $sid]);
        $r = $q->fetch();
        if ($r && ($now - (int)$r['ts']) < SID_COOLDOWN) return true;
    }
    if ($iph !== '') {
        $q = $pdo->prepare('SELECT ts FROM hits WHERE slug=? AND ip_hash=? ORDER BY ts DESC LIMIT 1');
        $q->execute([$slug, $iph]);
        $r = $q->fetch();
        if ($r && ($now - (int)$r['ts']) < IP_COOLDOWN) return true;
    }
    return false;
}

function is_unique_sid(PDO $pdo, string $slug, string $sid): bool {
    if ($sid === '') return false;
    $q = $pdo->prepare('SELECT 1 FROM hits WHERE slug=? AND sid=? LIMIT 1');
    $q->execute([$slug, $sid]);
    return $q->fetchColumn() === false;
}

function record_hit(PDO $pdo, string $slug, string $sid, string $iph, string $ua, string $ref): array {
    ensure_page_row($pdo, $slug);
    rollover_today_if_needed($pdo, $slug);

    $bot = is_bot($ua) ? 1 : 0;
    $unique = !$bot && is_unique_sid($pdo, $slug, $sid);

    $pdo->beginTransaction();
    try {
        $pdo->prepare('
            INSERT INTO hits(slug,sid,ip_hash,ua,ref,is_bot,ts,day)
            VALUES(?,?,?,?,?,?,?,?)
        ')->execute([$slug, $sid, $iph, substr($ua,0,255), substr($ref,0,255), $bot, now_ts(), today_str()]);

        if ($bot) {
            $pdo->prepare('UPDATE pages SET bots=bots+1, last_seen=? WHERE slug=?')
                ->execute([now_ts(), $slug]);
        } else {
            $pdo->prepare('
                UPDATE pages
                SET total      = total + 1,
                    today      = today + 1,
                    today_date = ?,
                    uniques    = uniques + ?,
                    last_seen  = ?
                WHERE slug = ?
            ')->execute([today_str(), $unique ? 1 : 0, now_ts(), $slug]);

            $pdo->prepare('
                INSERT INTO daily(slug,day,hits,uniques) VALUES(?,?,1,?)
                ON CONFLICT(slug,day) DO UPDATE SET
                    hits    = hits    + 1,
                    uniques = uniques + excluded.uniques
            ')->execute([$slug, today_str(), $unique ? 1 : 0]);
        }
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        out_err('write failed', 500);
    }

    return get_page_stats($pdo, $slug);
}

function get_page_stats(PDO $pdo, string $slug): array {
    ensure_page_row($pdo, $slug);
    rollover_today_if_needed($pdo, $slug);
    $q = $pdo->prepare('SELECT total,uniques,today,today_date,bots,first_seen,last_seen FROM pages WHERE slug=?');
    $q->execute([$slug]);
    $r = $q->fetch();
    return [
        'page'    => $slug,
        'views'   => (int)($r['total']    ?? 0),
        'uniques' => (int)($r['uniques']  ?? 0),
        'today'   => (int)($r['today']    ?? 0),
        'bots'    => (int)($r['bots']     ?? 0),
        'first'   => (int)($r['first_seen']?? 0),
        'last'    => (int)($r['last_seen'] ?? 0),
    ];
}

function get_top_pages(PDO $pdo, int $limit = TOP_LIMIT): array {
    $q = $pdo->prepare('SELECT slug,total,uniques,today,last_seen FROM pages ORDER BY total DESC LIMIT ?');
    $q->bindValue(1, $limit, PDO::PARAM_INT);
    $q->execute();
    return $q->fetchAll();
}

function get_timeseries(PDO $pdo, string $slug, int $days = TIMESERIES_DAYS): array {
    $q = $pdo->prepare('
        SELECT day, hits, uniques FROM daily
        WHERE slug = ?
        ORDER BY day DESC
        LIMIT ?
    ');
    $q->bindValue(1, $slug, PDO::PARAM_STR);
    $q->bindValue(2, $days, PDO::PARAM_INT);
    $q->execute();
    return array_reverse($q->fetchAll());
}

function totals(PDO $pdo): array {
    $r = $pdo->query('SELECT COUNT(*) AS pages, COALESCE(SUM(total),0) AS views, COALESCE(SUM(uniques),0) AS uniques FROM pages')->fetch();
    return [
        'pages'   => (int)($r['pages']   ?? 0),
        'views'   => (int)($r['views']   ?? 0),
        'uniques' => (int)($r['uniques'] ?? 0),
    ];
}

/* ──────────────────── ROUTING ──────────────────── */
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$page   = clean_slug($_GET['page'] ?? null);
$sid    = clean_sid($_GET['sid']   ?? null);
$ua     = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
$ref    = (string)($_GET['ref'] ?? ($_SERVER['HTTP_REFERER'] ?? ''));
$iph    = ip_hash(client_ip());
$pdo    = db();

/* ── stats endpoints (require admin token for full payload) ── */
if (isset($_GET['stats'])) {
    if (!admin_token_ok()) {
        // Anonymous read of a single page is allowed (page total only); the
        // top/leaderboard and full timeseries require the admin token.
        if (!empty($_GET['page'])) {
            out_json(array_merge(
                ['ok' => true, 'bumped' => false, 'restricted' => true, 'ts' => now_ts()],
                get_page_stats($pdo, $page)
            ));
        }
        out_err('admin token required for global stats', 401);
    }
    if (!empty($_GET['page'])) {
        out_json([
            'ok'         => true,
            'page'       => $page,
            'stats'      => get_page_stats($pdo, $page),
            'timeseries' => get_timeseries($pdo, $page),
            'ts'         => now_ts(),
        ]);
    }
    out_json([
        'ok'     => true,
        'totals' => totals($pdo),
        'top'    => get_top_pages($pdo),
        'ts'     => now_ts(),
    ]);
}

/* ── increment on POST or GET&hit=1 ── */
$shouldIncrement = ($method === 'POST') || (!empty($_GET['hit']));

if ($shouldIncrement) {
    // Token check: legitimate 2030B traffic carries the client token.
    if (REQUIRE_TOKEN && !client_token_ok()) {
        out_err('invalid or missing token', 401);
    }
    if (under_cooldown($pdo, $page, $sid, $iph)) {
        $stats = get_page_stats($pdo, $page);
        out_json(array_merge(['ok' => true, 'bumped' => false, 'cooldown' => true, 'ts' => now_ts()], $stats));
    }
    $stats = record_hit($pdo, $page, $sid, $iph, $ua, $ref);
    out_json(array_merge(['ok' => true, 'bumped' => true, 'ts' => now_ts()], $stats));
}

/* ── plain GET → just read ── */
if (!empty($_GET['page'])) {
    out_json(array_merge(['ok' => true, 'bumped' => false, 'ts' => now_ts()], get_page_stats($pdo, $page)));
}

/* ── default landing → service banner; full totals/top only with admin token ── */
$banner = [
    'ok'       => true,
    'service'  => '2030B Views Counter',
    'author'   => 'Maher © 2026',
    'endpoint' => 'https://2030b.com/views_url/index.php',
    'auth'     => [
        'client_token_required' => REQUIRE_TOKEN,
        'admin_token_required_for_stats' => true,
        'methods' => ['?token=…', 'X-2030B-Token: …', 'Authorization: Bearer …'],
    ],
    'ts'      => now_ts(),
];
if (admin_token_ok()) {
    $banner['totals'] = totals($pdo);
    $banner['top']    = get_top_pages($pdo, 25);
}
out_json($banner);
