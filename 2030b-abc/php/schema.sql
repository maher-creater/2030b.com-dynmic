-- 2030B-ABC · كن أعقل · Binance Pay ledger schema
-- Target: 4,000,000,000 rows (≈ $120B in transactions at $30/copy)
-- Storage: SQLite WAL mode, partition-friendly indexes.
-- © 2026 Maher. All rights reserved.

PRAGMA journal_mode = WAL;
PRAGMA synchronous  = NORMAL;
PRAGMA temp_store   = MEMORY;
PRAGMA mmap_size    = 268435456;   -- 256 MB memory-mapped reads
PRAGMA cache_size   = -200000;     -- 200 MB page cache
PRAGMA page_size    = 8192;        -- bigger pages for fewer btree levels
PRAGMA busy_timeout = 8000;

-- ────────────────────────────────────────────────────────────────
-- 1) TRANSACTIONS — one row per paid copy.
--    Designed for 4 × 10⁹ rows. Sharded by year-month in `bucket`.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id        TEXT    NOT NULL UNIQUE,            -- merchantTradeNo, our UUID
    prepay_id       TEXT    NOT NULL DEFAULT '',        -- returned by Binance Pay
    binance_user_id TEXT    NOT NULL,                   -- unique Binance buyer ID (payerId)
    buyer_email     TEXT    NOT NULL DEFAULT '',
    buyer_country   TEXT    NOT NULL DEFAULT '',
    book_slug       TEXT    NOT NULL DEFAULT 'kun-a3qal',
    book_edition    TEXT    NOT NULL DEFAULT 'ar-v1',
    currency        TEXT    NOT NULL DEFAULT 'USDT',    -- USDT | BNB | BUSD
    amount_usd      REAL    NOT NULL DEFAULT 30.00,     -- cover price in USD
    amount_crypto   REAL    NOT NULL DEFAULT 0,         -- charged crypto amount
    fx_rate         REAL    NOT NULL DEFAULT 1,         -- crypto → USD at charge time
    royalty_pct     REAL    NOT NULL DEFAULT 0.10,      -- 10% to Maher
    royalty_usd     REAL    NOT NULL DEFAULT 3.00,      -- = amount_usd × royalty_pct
    royalty_paid    INTEGER NOT NULL DEFAULT 0,         -- 0 pending · 1 paid out
    status          TEXT    NOT NULL DEFAULT 'INITIAL', -- INITIAL|PENDING|PAID|EXPIRED|CANCELED|REFUNDED|ERROR
    bn_status       TEXT    NOT NULL DEFAULT '',        -- raw Binance status string
    ip_hash         TEXT    NOT NULL DEFAULT '',
    user_agent      TEXT    NOT NULL DEFAULT '',
    referer         TEXT    NOT NULL DEFAULT '',
    raw_payload     TEXT    NOT NULL DEFAULT '',        -- last webhook JSON
    bucket          TEXT    NOT NULL,                   -- YYYY-MM shard key
    created_at      INTEGER NOT NULL,
    paid_at         INTEGER NOT NULL DEFAULT 0,
    updated_at      INTEGER NOT NULL
);

-- Hot lookups
CREATE INDEX IF NOT EXISTS idx_tx_order        ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_tx_binance_uid  ON transactions(binance_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_tx_status       ON transactions(status, created_at);
CREATE INDEX IF NOT EXISTS idx_tx_bucket       ON transactions(bucket, status);
CREATE INDEX IF NOT EXISTS idx_tx_book         ON transactions(book_slug, status, created_at);
CREATE INDEX IF NOT EXISTS idx_tx_royalty      ON transactions(royalty_paid, status);

-- ────────────────────────────────────────────────────────────────
-- 2) BUYERS — unique Binance users, lifetime aggregates.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buyers (
    binance_user_id TEXT    PRIMARY KEY,
    first_seen      INTEGER NOT NULL,
    last_seen       INTEGER NOT NULL,
    copies          INTEGER NOT NULL DEFAULT 0,
    spent_usd       REAL    NOT NULL DEFAULT 0,
    royalty_usd     REAL    NOT NULL DEFAULT 0,
    country         TEXT    NOT NULL DEFAULT '',
    email_hash      TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_buyers_country  ON buyers(country);
CREATE INDEX IF NOT EXISTS idx_buyers_spent    ON buyers(spent_usd DESC);

-- ────────────────────────────────────────────────────────────────
-- 3) ROYALTIES — per-payout batches to Maher's Binance wallet.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS royalties (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id        TEXT    NOT NULL UNIQUE,
    period_start    INTEGER NOT NULL,
    period_end      INTEGER NOT NULL,
    tx_count        INTEGER NOT NULL DEFAULT 0,
    gross_usd       REAL    NOT NULL DEFAULT 0,
    royalty_usd     REAL    NOT NULL DEFAULT 0,
    payout_currency TEXT    NOT NULL DEFAULT 'USDT',
    payout_amount   REAL    NOT NULL DEFAULT 0,
    payout_tx_hash  TEXT    NOT NULL DEFAULT '',
    payout_status   TEXT    NOT NULL DEFAULT 'PENDING', -- PENDING|SENT|FAILED
    created_at      INTEGER NOT NULL,
    settled_at      INTEGER NOT NULL DEFAULT 0
);

-- ────────────────────────────────────────────────────────────────
-- 4) DAILY ROLLUPS — feeds the dashboard without scanning hot table.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_stats (
    day             TEXT    PRIMARY KEY,                -- YYYY-MM-DD
    copies          INTEGER NOT NULL DEFAULT 0,
    gross_usd       REAL    NOT NULL DEFAULT 0,
    royalty_usd     REAL    NOT NULL DEFAULT 0,
    unique_buyers   INTEGER NOT NULL DEFAULT 0,
    refunds         INTEGER NOT NULL DEFAULT 0
);

-- ────────────────────────────────────────────────────────────────
-- 5) IDEMPOTENCY — webhook replay protection.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_log (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    bizid           TEXT    NOT NULL,                    -- Binance bizId
    biztype         TEXT    NOT NULL,                    -- PAY | PAY_REFUND
    bizstatus       TEXT    NOT NULL,
    order_id        TEXT    NOT NULL DEFAULT '',
    received_at     INTEGER NOT NULL,
    signature_ok    INTEGER NOT NULL DEFAULT 0,
    payload         TEXT    NOT NULL DEFAULT '',
    UNIQUE(bizid, biztype)
);

CREATE TABLE IF NOT EXISTS meta (
    k TEXT PRIMARY KEY,
    v TEXT
);
