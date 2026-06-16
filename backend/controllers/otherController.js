// Controller: LaundryKu
// Dikerjakan oleh: Rizky Ramadhan
// NIM: 2410501112
// Tanggal: 16 Juni 2026
const { Payment, Order, Expense, Notification, Customer, User, OrderItem, Service, Employee } = require('../models');
const { Op } = require('sequelize');

// ── PAYMENT ───────────────────────────────────────────────
exports.createPayment = async (req, res) => {
  try {
    const { order_id, amount, method, notes } = req.body;
    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
    const payment = await Payment.create({ order_id, amount, method, notes, paid_at: new Date() });
    await order.update({ payment_status: 'paid' });
    res.status(201).json({ message: 'Pembayaran berhasil', payment });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllPayments = async (req, res) => {
  try {
    res.json(await Payment.findAll({
      include: [{ model: Order, include: [{ model: Customer, include: [{ model: User, attributes: ['name'] }] }] }],
      order: [['id','DESC']],
    }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── EXPENSE ───────────────────────────────────────────────
exports.getAllExpenses = async (req, res) => {
  try { res.json(await Expense.findAll({ order: [['expense_date','DESC']] })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createExpense = async (req, res) => {
  try { res.status(201).json(await Expense.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Pengeluaran dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── NOTIFICATION ─────────────────────────────────────────
exports.getMyNotifications = async (req, res) => {
  try {
    res.json(await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at','DESC']],
      limit: 20,
    }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.readNotification = async (req, res) => {
  try {
    await Notification.update({ is_read: true }, { where: { id: req.params.id, user_id: req.user.id } });
    res.json({ message: 'Notifikasi dibaca' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DASHBOARD ─────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalCustomers = await Customer.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const processingOrders = await Order.count({ where: { status: ['processing','washing','drying','ironing'] } });
    const doneOrders = await Order.count({ where: { status: ['done','delivered'] } });
    const unpaidOrders = await Order.count({ where: { payment_status: 'unpaid', status: { [Op.ne]: 'cancelled' } } });
    const totalRevenue = await Payment.sum('amount') || 0;
    const totalExpenses = await Expense.sum('amount') || 0;

    const recentOrders = await Order.findAll({
      include: [
        { model: Customer, include: [{ model: User, attributes: ['name','phone'] }] },
        { model: OrderItem, include: [{ model: Service, attributes: ['name'] }] },
      ],
      order: [['id','DESC']], limit: 8,
    });

    res.json({
      totalOrders, totalCustomers, pendingOrders, processingOrders,
      doneOrders, unpaidOrders, totalRevenue, totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      recentOrders,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
