const { Order, OrderItem, Service, Customer, User, Employee, Payment, Notification } = require('../models');

const makeCode = () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  return `LDR-${ymd}-${String(Math.floor(Math.random()*9000)+1000)}`;
};

exports.getAll = async (req, res) => {
  try {
    res.json(await Order.findAll({
      include: [
        { model: Customer, include: [{ model: User, attributes: ['name','phone'] }] },
        { model: Employee, attributes: ['name','position'] },
        { model: OrderItem, include: [{ model: Service, attributes: ['name','unit'] }] },
        { model: Payment },
      ],
      order: [['id','DESC']],
    }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const o = await Order.findByPk(req.params.id, {
      include: [
        { model: Customer, include: [User] },
        { model: Employee },
        { model: OrderItem, include: [Service] },
        { model: Payment },
      ],
    });
    if (!o) return res.status(404).json({ message: 'Order tidak ditemukan' });
    res.json(o);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { user_id: req.user.id } });
    if (!customer) return res.json([]);
    res.json(await Order.findAll({
      where: { customer_id: customer.id },
      include: [
        { model: OrderItem, include: [Service] },
        { model: Employee, attributes: ['name'] },
        { model: Payment },
      ],
      order: [['id','DESC']],
    }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { customer_id, items, notes, employee_id } = req.body;
    const today = new Date().toISOString().split('T')[0];
    let total = 0;
    const itemsData = [];

    for (const item of items) {
      const svc = await Service.findByPk(item.service_id);
      if (!svc) continue;
      const price = svc.unit === 'kg' ? Number(svc.price_per_kg) : Number(svc.price_per_item);
      const subtotal = price * item.quantity;
      total += subtotal;
      itemsData.push({ service_id: item.service_id, quantity: item.quantity, price, subtotal });
    }

    const maxDays = Math.max(...(await Promise.all(items.map(i => Service.findByPk(i.service_id)))).map(s => s?.estimated_days || 2));
    const estDone = new Date(); estDone.setDate(estDone.getDate() + maxDays);

    const order = await Order.create({
      order_code: makeCode(),
      customer_id, employee_id: employee_id || null,
      order_date: today,
      estimated_done: estDone.toISOString().split('T')[0],
      notes: notes || '',
      total_amount: total,
      status: 'pending',
    });

    for (const item of itemsData) {
      await OrderItem.create({ ...item, order_id: order.id });
    }

    await Customer.increment('total_orders', { where: { id: customer_id } });

    // notif ke customer
    const cust = await Customer.findByPk(customer_id, { include: [User] });
    if (cust?.User) {
      await Notification.create({
        user_id: cust.User.id,
        title: 'Order Diterima!',
        message: `Order ${order.order_code} berhasil dibuat. Total: Rp ${total.toLocaleString('id-ID')}`,
      });
    }

    res.status(201).json({ message: 'Order berhasil dibuat', order });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Customer, include: [User] }],
    });
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });

    const updateData = { status };
    if (status === 'done') updateData.done_date = new Date().toISOString().split('T')[0];

    await order.update(updateData);

    // notif ke customer
    const statusLabel = { processing:'Sedang Diproses', washing:'Sedang Dicuci', drying:'Sedang Dikeringkan', ironing:'Sedang Disetrika', done:'Selesai! Siap Diambil', delivered:'Sudah Dikirim', cancelled:'Dibatalkan' };
    if (order.Customer?.User && statusLabel[status]) {
      await Notification.create({
        user_id: order.Customer.User.id,
        title: `Update Order ${order.order_code}`,
        message: `Status laundry kamu: ${statusLabel[status]}`,
      });
    }

    res.json({ message: 'Status diperbarui' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.destroy = async (req, res) => {
  try {
    await Order.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Order dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
