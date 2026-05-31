import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/connection.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'videobelajar_secret_key';
const JWT_EXPIRES = '7d';

// POST /register - daftarkan user baru
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: name, email, password',
      });
    }

    // Cek email sudah terdaftar
    const existing = db.prepare('SELECT id FROM user WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    }

    // Generate token verifikasi email
    const verifyToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    const result = db.prepare(`
      INSERT INTO user (name, email, phone, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, phone ?? null, password, role ?? 'student');

    const newUser = db.prepare(
      'SELECT id, name, email, phone, avatar, joined, role FROM user WHERE id = ?'
    ).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Silakan verifikasi email kamu.',
      data: newUser,
      verifyToken,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /login - login dengan email & password
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: email, password',
      });
    }

    const user = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    // Bandingkan password (plaintext — untuk production gunakan bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /verify-email?token=... - verifikasi token dari email
router.get('/verify-email', (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = db.prepare('SELECT id, name, email FROM user WHERE email = ?').get(decoded.email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Email berhasil diverifikasi',
      data: user,
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token sudah kadaluarsa' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token tidak valid' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
