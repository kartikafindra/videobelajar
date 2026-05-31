import { Router } from "express";
import db from "../db/connection.js";

const router = Router();

// GET /course
// router.get('/', (req, res) => {
//   try {
//     const courses = db.prepare(`
//       SELECT
//         pk.id, pk.judulProduk, pk.subJudul, pk.deskripsi, pk.urlFotoProduk,
//         pk.harga, pk.rating, pk.reviews,
//         t.namaMentor, t.roleMentor, t.urlFotoMentor,
//         kk.namaKategori
//       FROM produk_kelas pk
//       JOIN tutor t ON pk.tutor_id = t.id
//       JOIN kategori_kelas kk ON pk.kategori_id = kk.id
//     `).all();
//     res.json({ success: true, data: courses });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// GET /course - list kelas dengan filter query params: topic, sortBy, search
router.get("/", (req, res) => {
  try {
    const { topic, sortBy, search } = req.query;

    let query = `
      SELECT
        pk.id,
        pk.judulProduk,
        pk.subJudul,
        pk.deskripsi,
        pk.urlFotoProduk,
        pk.harga,
        pk.rating,
        pk.reviews,
        t.namaMentor,
        t.roleMentor,
        t.urlFotoMentor,
        kk.namaKategori
      FROM produk_kelas pk
      JOIN tutor t ON pk.tutor_id = t.id
      JOIN kategori_kelas kk ON pk.kategori_id = kk.id
      WHERE 1=1
    `;

    const params = [];

    // Filter by topic (nama kategori)
    if (topic) {
      query += ` AND LOWER(kk.namaKategori) = LOWER(?)`;
      params.push(topic);
    }

    // Search by judul atau deskripsi
    if (search) {
      query += ` AND (pk.judulProduk LIKE ? OR pk.deskripsi LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sort
    const sortOptions = {
      rating: "pk.rating DESC",
      harga_asc: "pk.harga ASC",
      harga_desc: "pk.harga DESC",
      terbaru: "pk.id DESC",
      reviews: "pk.reviews DESC",
    };
    query += ` ORDER BY ${sortOptions[sortBy] || "pk.id ASC"}`;

    const courses = db.prepare(query).all(...params);

    res.json({ success: true, total: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /course/:id - detail satu kelas
router.get("/:id", (req, res) => {
  try {
    const course = db
      .prepare(
        `
      SELECT
        pk.id,
        pk.judulProduk,
        pk.subJudul,
        pk.deskripsi,
        pk.urlFotoProduk,
        pk.harga,
        pk.rating,
        pk.reviews,
        pk.tutor_id,
        pk.kategori_id,
        t.namaMentor,
        t.roleMentor,
        t.urlFotoMentor,
        kk.namaKategori
      FROM produk_kelas pk
      JOIN tutor t ON pk.tutor_id = t.id
      JOIN kategori_kelas kk ON pk.kategori_id = kk.id
      WHERE pk.id = ?
    `,
      )
      .get(req.params.id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Kelas tidak ditemukan" });
    }

    // Ambil modul kelas
    const modules = db
      .prepare(
        `
      SELECT id, judulModul, urutan FROM modul_kelas WHERE produk_id = ? ORDER BY urutan
    `,
      )
      .all(req.params.id);

    res.json({ success: true, data: { ...course, modules } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /course - tambah kelas baru
router.post("/", (req, res) => {
  try {
    const {
      tutor_id,
      kategori_id,
      judulProduk,
      subJudul,
      deskripsi,
      urlFotoProduk,
      harga,
      rating,
      reviews,
    } = req.body;

    if (!tutor_id || !kategori_id || !judulProduk || harga === undefined) {
      return res.status(400).json({
        success: false,
        message: "Field wajib: tutor_id, kategori_id, judulProduk, harga",
      });
    }

    const stmt = db.prepare(`
      INSERT INTO produk_kelas (tutor_id, kategori_id, judulProduk, subJudul, deskripsi, urlFotoProduk, harga, rating, reviews)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      tutor_id,
      kategori_id,
      judulProduk,
      subJudul ?? null,
      deskripsi ?? null,
      urlFotoProduk ?? null,
      harga,
      rating ?? 0.0,
      reviews ?? 0,
    );

    const newCourse = db
      .prepare("SELECT * FROM produk_kelas WHERE id = ?")
      .get(result.lastInsertRowid);

    res
      .status(201)
      .json({
        success: true,
        message: "Kelas berhasil ditambahkan",
        data: newCourse,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT/PATCH /course/:id - update kelas
router.put("/:id", updateCourse);
router.patch("/:id", updateCourse);

function updateCourse(req, res) {
  try {
    const existing = db
      .prepare("SELECT * FROM produk_kelas WHERE id = ?")
      .get(req.params.id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Kelas tidak ditemukan" });
    }

    const {
      tutor_id,
      kategori_id,
      judulProduk,
      subJudul,
      deskripsi,
      urlFotoProduk,
      harga,
      rating,
      reviews,
    } = req.body;

    const updated = {
      tutor_id: tutor_id ?? existing.tutor_id,
      kategori_id: kategori_id ?? existing.kategori_id,
      judulProduk: judulProduk ?? existing.judulProduk,
      subJudul: subJudul ?? existing.subJudul,
      deskripsi: deskripsi ?? existing.deskripsi,
      urlFotoProduk: urlFotoProduk ?? existing.urlFotoProduk,
      harga: harga ?? existing.harga,
      rating: rating ?? existing.rating,
      reviews: reviews ?? existing.reviews,
    };

    db.prepare(
      `
      UPDATE produk_kelas
      SET tutor_id = ?, kategori_id = ?, judulProduk = ?, subJudul = ?,
          deskripsi = ?, urlFotoProduk = ?, harga = ?, rating = ?, reviews = ?
      WHERE id = ?
    `,
    ).run(
      updated.tutor_id,
      updated.kategori_id,
      updated.judulProduk,
      updated.subJudul,
      updated.deskripsi,
      updated.urlFotoProduk,
      updated.harga,
      updated.rating,
      updated.reviews,
      req.params.id,
    );

    const result = db
      .prepare("SELECT * FROM produk_kelas WHERE id = ?")
      .get(req.params.id);
    res.json({
      success: true,
      message: "Kelas berhasil diupdate",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /course/:id - hapus kelas
router.delete("/:id", (req, res) => {
  try {
    const existing = db
      .prepare("SELECT * FROM produk_kelas WHERE id = ?")
      .get(req.params.id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Kelas tidak ditemukan" });
    }

    db.prepare("DELETE FROM produk_kelas WHERE id = ?").run(req.params.id);

    res.json({ success: true, message: "Kelas berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
