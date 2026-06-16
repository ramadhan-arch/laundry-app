const { Customer, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    res.json(await Customer.findAll({
      include: [{ model: User, attributes: ['name','email','phone','address','created_at'] }],
      order: [['id','DESC']],
    }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const c = await Customer.findByPk(req.params.id, { include: [User] });
    if (!c) return res.status(404).json({ message: 'Customer tidak ditemukan' });
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const c = await Customer.findByPk(req.params.id);
    if (!c) return res.status(404).json({ message: 'Customer tidak ditemukan' });
    await User.update({ name, phone, address }, { where: { id: c.user_id } });
    res.json({ message: 'Customer diperbarui' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.destroy = async (req, res) => {
  try {
    const c = await Customer.findByPk(req.params.id);
    if (!c) return res.status(404).json({ message: 'Customer tidak ditemukan' });
    await User.destroy({ where: { id: c.user_id } });
    res.json({ message: 'Customer dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
