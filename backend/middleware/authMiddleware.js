// authmiddleware: LaundryKu
// Dikerjakan oleh: Ananda Wirajaya
// NIM: 2410501111
// Tanggal: 16 Juni 2026

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Token tidak ada' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ message: 'Token tidak valid' }); }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Akses admin saja' });
  next();
};

module.exports = { auth, adminOnly };
