const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const { authR, serviceR, employeeR, customerR, orderR, paymentR, expenseR, notifR, dashR } = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authR);
app.use('/api/services', serviceR);
app.use('/api/employees', employeeR);
app.use('/api/customers', customerR);
app.use('/api/orders', orderR);
app.use('/api/payments', paymentR);
app.use('/api/expenses', expenseR);
app.use('/api/notifications', notifR);
app.use('/api/dashboard', dashR);

sequelize.authenticate()
  .then(() => console.log('✅ Database terhubung'))
  .catch(err => console.error('❌ Gagal koneksi DB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server jalan di port ${PORT}`));
