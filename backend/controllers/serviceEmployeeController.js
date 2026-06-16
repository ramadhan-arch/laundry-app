const { Service, Employee } = require('../models');

// ── SERVICES ──────────────────────────────────────────────
exports.getAllServices = async (req, res) => {
  try { res.json(await Service.findAll({ order: [['id','ASC']] })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createService = async (req, res) => {
  try { res.status(201).json(await Service.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateService = async (req, res) => {
  try {
    await Service.update(req.body, { where: { id: req.params.id } });
    res.json(await Service.findByPk(req.params.id));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteService = async (req, res) => {
  try {
    await Service.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Layanan dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── EMPLOYEES ─────────────────────────────────────────────
exports.getAllEmployees = async (req, res) => {
  try { res.json(await Employee.findAll({ order: [['id','ASC']] })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createEmployee = async (req, res) => {
  try { res.status(201).json(await Employee.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateEmployee = async (req, res) => {
  try {
    await Employee.update(req.body, { where: { id: req.params.id } });
    res.json(await Employee.findByPk(req.params.id));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Karyawan dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
