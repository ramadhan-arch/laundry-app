// Routes/Models: LaundryKu
// Dikerjakan oleh: Ananda Wirajaya & Team
// NIM: 2410501111
// Tanggal: 16 Juni 2026 (Updated with Delivery Features)

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: { type: DataTypes.ENUM('admin','customer'), defaultValue: 'customer' },
  phone: DataTypes.STRING,
  address: DataTypes.TEXT,
}, { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Customer = sequelize.define('Customer', {
  user_id: DataTypes.INTEGER,
  customer_code: { type: DataTypes.STRING, unique: true },
  total_orders: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'customers', timestamps: false });

const Service = sequelize.define('Service', {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price_per_kg: DataTypes.DECIMAL(10,2),
  price_per_item: DataTypes.DECIMAL(10,2),
  unit: { type: DataTypes.ENUM('kg','item','set'), defaultValue: 'kg' },
  estimated_days: { type: DataTypes.INTEGER, defaultValue: 2 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'services', timestamps: false });

const Employee = sequelize.define('Employee', {
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  position: DataTypes.STRING,
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'employees', timestamps: false });

const Order = sequelize.define('Order', {
  order_code: { type: DataTypes.STRING, unique: true },
  customer_id: DataTypes.INTEGER,
  employee_id: DataTypes.INTEGER,
  order_date: DataTypes.DATEONLY,
  pickup_date: DataTypes.DATEONLY,
  estimated_done: DataTypes.DATEONLY,
  done_date: DataTypes.DATEONLY,
  
  // METODE ANTAR JEMPUT DRIVER
  delivery_method: { 
    type: DataTypes.ENUM('drop_off_pickup_self', 'pickup_only', 'delivery_only', 'shuttle'), 
    defaultValue: 'drop_off_pickup_self' 
  },

  // ALAMAT OPERASIONAL JEMPUT & ANTAR
  pickup_address: { type: DataTypes.TEXT, allowNull: true },
  delivery_address: { type: DataTypes.TEXT, allowNull: true },

  status: {
    type: DataTypes.ENUM(
      'pending', 
      'waiting_pickup',    
      'pickup_process',    
      'processing', 
      'washing', 
      'drying', 
      'ironing', 
      'done', 
      'delivery_process',  
      'delivered', 
      'cancelled'
    ),
    defaultValue: 'pending'
  },
  notes: DataTypes.TEXT,
  total_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  payment_status: { type: DataTypes.ENUM('unpaid','paid'), defaultValue: 'unpaid' },
}, { tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: false });

const OrderItem = sequelize.define('OrderItem', {
  order_id: DataTypes.INTEGER,
  service_id: DataTypes.INTEGER,
  quantity: DataTypes.DECIMAL(10,2),
  price: DataTypes.DECIMAL(10,2),
  subtotal: DataTypes.DECIMAL(10,2),
}, { tableName: 'order_items', timestamps: false });

const Payment = sequelize.define('Payment', {
  order_id: DataTypes.INTEGER,
  amount: DataTypes.DECIMAL(10,2),
  method: { type: DataTypes.ENUM('cash','transfer','qris'), defaultValue: 'cash' },
  paid_at: DataTypes.DATE,
  notes: DataTypes.TEXT,
}, { tableName: 'payments', timestamps: false });

const Expense = sequelize.define('Expense', {
  description: DataTypes.STRING,
  amount: DataTypes.DECIMAL(10,2),
  category: DataTypes.STRING,
  expense_date: DataTypes.DATEONLY,
}, { tableName: 'expenses', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Notification = sequelize.define('Notification', {
  user_id: DataTypes.INTEGER,
  title: DataTypes.STRING,
  message: DataTypes.TEXT,
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'notifications', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Setting = sequelize.define('Setting', {
  key_name: { type: DataTypes.STRING, unique: true },
  value: DataTypes.TEXT,
}, { tableName: 'settings', timestamps: false });

// Associations
Customer.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Customer, { foreignKey: 'user_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Employee, { foreignKey: 'employee_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Service, { foreignKey: 'service_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasOne(Payment, { foreignKey: 'order_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Customer, Service, Employee, Order, OrderItem, Payment, Expense, Notification, Setting };