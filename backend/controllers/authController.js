// Controller: LaundryKu
// Dikerjakan oleh: Rizky Ramadhan
// NIM: 2410501112
// Tanggal: 16 Juni 2026
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Customer } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password salah' });
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET, { expiresIn: '1d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email, phone: user.phone } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email sudah terdaftar' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'customer', phone: phone || '', address: address || '' });
    const count = await Customer.count();
    await Customer.create({
      user_id: user.id,
      customer_code: 'CST' + String(count + 1).padStart(4, '0'),
    });
    res.status(201).json({ message: 'Registrasi berhasil, silakan login' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Customer }],
    });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await User.update({ name, phone, address }, { where: { id: req.user.id } });
    res.json({ message: 'Profil diperbarui' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
