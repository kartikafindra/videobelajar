import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

// GET /user - list semua user
router.get('/', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, name, email, phone, avatar, joined, role FROM user
    `).all();

    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /user/:id - detail satu user
router.get('/:id', (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, name, email, phone, avatar, joined, role FROM user WHERE id = ?
    `).get(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    // Ambil kelas yang diikuti
    const myClasses = db.prepare(`
      SELECT ks.id, pk.judulProduk, ks.tanggalDaftar, ks.progress, ks.status
      FROM kelas_saya ks
      JOIN produk_kelas pk ON ks.produk_id = pk.id
      WHERE ks.user_id = ?
    `).all(req.params.id);

    res.json({ success: true, data: { ...user, kelasSaya: myClasses } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /user - tambah user baru
router.post('/', (req, res) => {
  try {
    const { name, email, phone, avatar, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: name, email, password',
      });
    }

    const stmt = db.prepare(`
      INSERT INTO user (name, email, phone, avatar, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      email,
      phone ?? null,
      avatar ?? null,
      password,
      role ?? 'student'
    );

    const newUser = db.prepare(
      'SELECT id, name, email, phone, avatar, joined, role FROM user WHERE id = ?'
    ).get(result.lastInsertRowid);

    res.status(201).json({ success: true, message: 'User berhasil ditambahkan', data: newUser });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT/PATCH /user/:id - update user
router.put('/:id', updateUser);
router.patch('/:id', updateUser);

function updateUser(req, res) {
  try {
    const existing = db.prepare('SELECT * FROM user WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const { name, email, phone, avatar, role } = req.body;

    const updated = {
      name:   name   ?? existing.name,
      email:  email  ?? existing.email,
      phone:  phone  ?? existing.phone,
      avatar: avatar ?? existing.avatar,
      role:   role   ?? existing.role,
    };

    db.prepare(`
      UPDATE user SET name = ?, email = ?, phone = ?, avatar = ?, role = ? WHERE id = ?
    `).run(updated.name, updated.email, updated.phone, updated.avatar, updated.role, req.params.id);

    const result = db.prepare(
      'SELECT id, name, email, phone, avatar, joined, role FROM user WHERE id = ?'
    ).get(req.params.id);

    res.json({ success: true, message: 'User berhasil diupdate', data: result });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /user/:id - hapus user
router.delete('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM user WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    db.prepare('DELETE FROM user WHERE id = ?').run(req.params.id);

    res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
