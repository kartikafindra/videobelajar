-- Schema database VideoBelajar
-- Generated from erd_videobelajar.md

PRAGMA foreign_keys = ON;

-- ============================================================
-- TABLE: user
-- ============================================================
CREATE TABLE IF NOT EXISTS user (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    phone       TEXT,
    avatar      TEXT,
    password    TEXT    NOT NULL,
    joined      DATE    NOT NULL DEFAULT (DATE('now')),
    role        TEXT    NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin'))
);

-- ============================================================
-- TABLE: tutor
-- ============================================================
CREATE TABLE IF NOT EXISTS tutor (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    namaMentor      TEXT    NOT NULL,
    roleMentor      TEXT    NOT NULL,
    urlFotoMentor   TEXT
);

-- ============================================================
-- TABLE: kategori_kelas
-- ============================================================
CREATE TABLE IF NOT EXISTS kategori_kelas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    namaKategori    TEXT    NOT NULL UNIQUE
);

-- ============================================================
-- TABLE: produk_kelas
-- ============================================================
CREATE TABLE IF NOT EXISTS produk_kelas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    tutor_id        INTEGER NOT NULL,
    kategori_id     INTEGER NOT NULL,
    judulProduk     TEXT    NOT NULL,
    subJudul        TEXT,
    deskripsi       TEXT,
    urlFotoProduk   TEXT,
    harga           INTEGER NOT NULL DEFAULT 0,
    rating          REAL    NOT NULL DEFAULT 0.0,
    reviews         INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (tutor_id)    REFERENCES tutor (id)          ON DELETE RESTRICT,
    FOREIGN KEY (kategori_id) REFERENCES kategori_kelas (id) ON DELETE RESTRICT
);

-- ============================================================
-- TABLE: modul_kelas
-- ============================================================
CREATE TABLE IF NOT EXISTS modul_kelas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    produk_id   INTEGER NOT NULL,
    judulModul  TEXT    NOT NULL,
    urutan      INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (produk_id) REFERENCES produk_kelas (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: material
-- ============================================================
CREATE TABLE IF NOT EXISTS material (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    modul_id    INTEGER NOT NULL,
    judul       TEXT    NOT NULL,
    tipe        TEXT    NOT NULL CHECK (tipe IN ('video', 'artikel', 'quiz')),
    konten      TEXT,
    durasi      INTEGER DEFAULT 0,  -- dalam detik
    FOREIGN KEY (modul_id) REFERENCES modul_kelas (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: pretest
-- ============================================================
CREATE TABLE IF NOT EXISTS pretest (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    produk_id       INTEGER NOT NULL,
    pertanyaan      TEXT    NOT NULL,
    opsiJawaban     TEXT    NOT NULL,  -- disimpan sebagai JSON, contoh: '["A","B","C","D"]'
    jawabanBenar    TEXT    NOT NULL,
    FOREIGN KEY (produk_id) REFERENCES produk_kelas (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: kelas_saya
-- ============================================================
CREATE TABLE IF NOT EXISTS kelas_saya (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    produk_id       INTEGER NOT NULL,
    tanggalDaftar   DATE    NOT NULL DEFAULT (DATE('now')),
    progress        REAL    NOT NULL DEFAULT 0.0 CHECK (progress BETWEEN 0.0 AND 100.0),
    status          TEXT    NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'expired')),
    UNIQUE (user_id, produk_id),
    FOREIGN KEY (user_id)   REFERENCES user (id)         ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES produk_kelas (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: "order"  (dikutip karena ORDER adalah reserved word)
-- ============================================================
CREATE TABLE IF NOT EXISTS "order" (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    produk_id       INTEGER NOT NULL,
    tanggalOrder    DATE    NOT NULL DEFAULT (DATE('now')),
    totalHarga      INTEGER NOT NULL DEFAULT 0,
    status          TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    FOREIGN KEY (user_id)   REFERENCES user (id)         ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES produk_kelas (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: pembayaran
-- ============================================================
CREATE TABLE IF NOT EXISTS pembayaran (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id            INTEGER NOT NULL UNIQUE,  -- 1-to-1 dengan order
    metodePembayaran    TEXT    NOT NULL,
    tanggalBayar        DATE,
    statusBayar         TEXT    NOT NULL DEFAULT 'pending' CHECK (statusBayar IN ('pending', 'sukses', 'gagal')),
    jumlahBayar         INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES "order" (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: review
-- ============================================================
CREATE TABLE IF NOT EXISTS review (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    produk_id       INTEGER NOT NULL,
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    komentar        TEXT,
    tanggalReview   DATE    NOT NULL DEFAULT (DATE('now')),
    UNIQUE (user_id, produk_id),  -- satu user hanya bisa review satu kali per produk
    FOREIGN KEY (user_id)   REFERENCES user (id)         ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES produk_kelas (id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES untuk performa query
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_produk_kelas_tutor       ON produk_kelas (tutor_id);
CREATE INDEX IF NOT EXISTS idx_produk_kelas_kategori    ON produk_kelas (kategori_id);
CREATE INDEX IF NOT EXISTS idx_modul_kelas_produk       ON modul_kelas (produk_id);
CREATE INDEX IF NOT EXISTS idx_material_modul           ON material (modul_id);
CREATE INDEX IF NOT EXISTS idx_pretest_produk           ON pretest (produk_id);
CREATE INDEX IF NOT EXISTS idx_kelas_saya_user          ON kelas_saya (user_id);
CREATE INDEX IF NOT EXISTS idx_kelas_saya_produk        ON kelas_saya (produk_id);
CREATE INDEX IF NOT EXISTS idx_order_user               ON "order" (user_id);
CREATE INDEX IF NOT EXISTS idx_order_produk             ON "order" (produk_id);
CREATE INDEX IF NOT EXISTS idx_review_produk            ON review (produk_id);
