import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

// GET /order - list semua order
router.get('/', (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT
        o.id,
        o.tanggalOrder,
        o.totalHarga,
        o.status,
        u.name AS namaUser,
        u.email,
        pk.judulProduk
      FROM "order" o
      JOIN user u ON o.user_id = u.id
      JOIN produk_kelas pk ON o.produk_id = pk.id
    `).all();

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /order/:id - detail satu order
router.get('/:id', (req, res) => {
  try {
    const order = db.prepare(`
      SELECT
        o.id,
        o.user_id,
        o.produk_id,
        o.tanggalOrder,
        o.totalHarga,
        o.status,
        u.name AS namaUser,
        u.email,
        pk.judulProduk,
        pk.harga
      FROM "order" o
      JOIN user u ON o.user_id = u.id
      JOIN produk_kelas pk ON o.produk_id = pk.id
      WHERE o.id = ?
    `).get(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    }

    const payment = db.prepare(`
      SELECT * FROM pembayaran WHERE order_id = ?
    `).get(req.params.id);

    res.json({ success: true, data: { ...order, pembayaran: payment ?? null } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /order - buat order baru
router.post('/', (req, res) => {
  try {
    const { user_id, produk_id } = req.body;

    if (!user_id || !produk_id) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: user_id, produk_id',
      });
    }

    const produk = db.prepare('SELECT * FROM produk_kelas WHERE id = ?').get(produk_id);
    if (!produk) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const result = db.prepare(`
      INSERT INTO "order" (user_id, produk_id, totalHarga)
      VALUES (?, ?, ?)
    `).run(user_id, produk_id, produk.harga);

    const newOrder = db.prepare('SELECT * FROM "order" WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Order berhasil dibuat', data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /order/:id - update status order
router.patch('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM "order" WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    }

    const { status } = req.body;
    const validStatus = ['pending', 'paid', 'cancelled'];
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status harus salah satu dari: ${validStatus.join(', ')}`,
      });
    }

    db.prepare('UPDATE "order" SET status = ? WHERE id = ?').run(status, req.params.id);

    const result = db.prepare('SELECT * FROM "order" WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: 'Status order berhasil diupdate', data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /order/:id - hapus order
router.delete('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM "order" WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    }

    db.prepare('DELETE FROM "order" WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Order berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
