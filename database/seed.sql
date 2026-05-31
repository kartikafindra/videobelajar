-- Seed data untuk testing VideoBelajar

PRAGMA foreign_keys = ON;

-- ============================================================
-- TUTOR
-- ============================================================
INSERT INTO tutor (namaMentor, roleMentor, urlFotoMentor) VALUES
    ('Budi Santoso',    'Full Stack Developer',      'https://i.pravatar.cc/150?img=1'),
    ('Sari Dewi',       'UI/UX Designer',            'https://i.pravatar.cc/150?img=2'),
    ('Ahmad Fauzi',     'Data Scientist',            'https://i.pravatar.cc/150?img=3'),
    ('Rina Putri',      'Mobile Developer',          'https://i.pravatar.cc/150?img=4');

-- ============================================================
-- KATEGORI KELAS
-- ============================================================
INSERT INTO kategori_kelas (namaKategori) VALUES
    ('Web Development'),
    ('UI/UX Design'),
    ('Data Science'),
    ('Mobile Development'),
    ('DevOps');

-- ============================================================
-- USER
-- ============================================================
INSERT INTO user (name, email, phone, avatar, password, joined, role) VALUES
    ('Admin VideoBelajar', 'admin@videobelajar.com', '081200000001', NULL, 'hashed_password_admin', '2024-01-01', 'admin'),
    ('Andi Pratama',       'andi@example.com',       '081234567890', NULL, 'hashed_password_1',     '2024-03-10', 'student'),
    ('Maya Lestari',       'maya@example.com',       '081298765432', NULL, 'hashed_password_2',     '2024-04-15', 'student'),
    ('Reza Firmansyah',    'reza@example.com',       '081311112222', NULL, 'hashed_password_3',     '2024-05-01', 'student');

-- ============================================================
-- PRODUK KELAS
-- ============================================================
INSERT INTO produk_kelas (tutor_id, kategori_id, judulProduk, subJudul, deskripsi, urlFotoProduk, harga, rating, reviews) VALUES
    (1, 1, 'React.js untuk Pemula',
        'Kuasai React dari nol hingga mahir',
        'Kelas ini cocok untuk kamu yang ingin belajar React.js dari dasar. Mulai dari JSX, komponen, state, props, hingga React Router dan Redux.',
        'https://placehold.co/600x400?text=React', 299000, 4.8, 120),

    (1, 1, 'Node.js & Express API',
        'Bangun REST API profesional dengan Node.js',
        'Pelajari cara membuat backend API menggunakan Node.js dan Express, lengkap dengan autentikasi JWT dan integrasi database.',
        'https://placehold.co/600x400?text=NodeJS', 349000, 4.7, 95),

    (2, 2, 'Figma Mastery',
        'Desain UI/UX modern dengan Figma',
        'Dari wireframe hingga prototype interaktif. Pelajari semua fitur Figma yang digunakan desainer profesional.',
        'https://placehold.co/600x400?text=Figma', 249000, 4.9, 200),

    (3, 3, 'Python Data Science',
        'Analisis data dengan Python & Pandas',
        'Kuasai analisis data menggunakan Python, Pandas, Matplotlib, dan scikit-learn untuk machine learning dasar.',
        'https://placehold.co/600x400?text=DataScience', 399000, 4.6, 80),

    (4, 4, 'Flutter Development',
        'Buat aplikasi mobile Android & iOS',
        'Pelajari Flutter dari dasar untuk membangun aplikasi mobile cross-platform yang indah dan performant.',
        'https://placehold.co/600x400?text=Flutter', 379000, 4.7, 110);

-- ============================================================
-- MODUL KELAS
-- ============================================================
INSERT INTO modul_kelas (produk_id, judulModul, urutan) VALUES
    -- React.js untuk Pemula (produk_id=1)
    (1, 'Pengenalan React & Setup', 1),
    (1, 'Komponen & Props',         2),
    (1, 'State & Lifecycle',        3),
    (1, 'React Router',             4),
    -- Node.js & Express API (produk_id=2)
    (2, 'Dasar Node.js',            1),
    (2, 'Membuat REST API',         2),
    (2, 'Autentikasi JWT',          3),
    -- Figma Mastery (produk_id=3)
    (3, 'Pengenalan Figma',         1),
    (3, 'Wireframing',              2),
    (3, 'Prototyping',              3);

-- ============================================================
-- MATERIAL
-- ============================================================
INSERT INTO material (modul_id, judul, tipe, konten, durasi) VALUES
    -- Modul 1 - Pengenalan React
    (1, 'Apa itu React?',           'video',   'https://example.com/video/react-intro',    600),
    (1, 'Instalasi Node & Vite',    'video',   'https://example.com/video/setup-vite',     480),
    (1, 'Struktur Project React',   'artikel', 'Penjelasan struktur folder project React', NULL),
    -- Modul 2 - Komponen & Props
    (2, 'Membuat Komponen',         'video',   'https://example.com/video/komponen',       720),
    (2, 'Menggunakan Props',        'video',   'https://example.com/video/props',          540),
    -- Modul 5 - Dasar Node.js
    (5, 'Instalasi Node.js',        'video',   'https://example.com/video/nodejs-setup',   360),
    (5, 'Modul & NPM',              'video',   'https://example.com/video/npm',            480),
    -- Modul 9 - Pengenalan Figma
    (9, 'Tour Antarmuka Figma',     'video',   'https://example.com/video/figma-ui',       420),
    (9, 'Frame & Layer',            'video',   'https://example.com/video/figma-frame',    360);

-- ============================================================
-- PRETEST
-- ============================================================
INSERT INTO pretest (produk_id, pertanyaan, opsiJawaban, jawabanBenar) VALUES
    (1, 'Apa kepanjangan dari JSX?',
        '["JavaScript XML","Java Syntax Extension","JavaScript Extension","Java XML"]',
        'JavaScript XML'),

    (1, 'Hook manakah yang digunakan untuk state di React?',
        '["useEffect","useState","useContext","useRef"]',
        'useState'),

    (4, 'Library Python apa yang digunakan untuk manipulasi data tabular?',
        '["NumPy","Matplotlib","Pandas","Scikit-learn"]',
        'Pandas');

-- ============================================================
-- KELAS SAYA (enrollment)
-- ============================================================
INSERT INTO kelas_saya (user_id, produk_id, tanggalDaftar, progress, status) VALUES
    (2, 1, '2024-03-15', 75.0,  'aktif'),
    (2, 3, '2024-04-01', 100.0, 'selesai'),
    (3, 1, '2024-04-20', 30.0,  'aktif'),
    (3, 4, '2024-05-02', 10.0,  'aktif'),
    (4, 2, '2024-05-10', 50.0,  'aktif');

-- ============================================================
-- ORDER
-- ============================================================
INSERT INTO "order" (user_id, produk_id, tanggalOrder, totalHarga, status) VALUES
    (2, 1, '2024-03-15', 299000, 'paid'),
    (2, 3, '2024-04-01', 249000, 'paid'),
    (3, 1, '2024-04-20', 299000, 'paid'),
    (3, 4, '2024-05-02', 399000, 'paid'),
    (4, 2, '2024-05-10', 349000, 'paid'),
    (4, 5, '2024-05-20', 379000, 'pending');

-- ============================================================
-- PEMBAYARAN
-- ============================================================
INSERT INTO pembayaran (order_id, metodePembayaran, tanggalBayar, statusBayar, jumlahBayar) VALUES
    (1, 'Transfer Bank',    '2024-03-15', 'sukses', 299000),
    (2, 'GoPay',            '2024-04-01', 'sukses', 249000),
    (3, 'OVO',              '2024-04-20', 'sukses', 299000),
    (4, 'Transfer Bank',    '2024-05-02', 'sukses', 399000),
    (5, 'QRIS',             '2024-05-10', 'sukses', 349000),
    (6, 'GoPay',            NULL,         'pending', 379000);

-- ============================================================
-- REVIEW
-- ============================================================
INSERT INTO review (user_id, produk_id, rating, komentar, tanggalReview) VALUES
    (2, 1, 5, 'Materi sangat lengkap dan mudah dipahami, instruktur menjelaskan dengan sabar!', '2024-04-10'),
    (2, 3, 5, 'Figma Mastery benar-benar top, sekarang saya sudah bisa bikin prototype sendiri.', '2024-04-25'),
    (3, 1, 4, 'Bagus, tapi beberapa video kualitasnya bisa ditingkatkan lagi.', '2024-05-05'),
    (4, 2, 5, 'Node.js & Express diajarkan dengan sangat runtut, langsung bisa diterapkan.', '2024-05-18');
