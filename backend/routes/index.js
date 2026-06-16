const express = require('express');
const { auth, adminOnly } = require('../middleware/authMiddleware');
const se = require('../controllers/serviceEmployeeController');
const cust = require('../controllers/customerController');
const ord = require('../controllers/orderController');
const oth = require('../controllers/otherController');

// AUTH ROUTES
const authR = express.Router();
const authC = require('../controllers/authController');
authR.post('/login', authC.login);
authR.post('/register', authC.register);
authR.get('/me', auth, authC.me);
authR.put('/profile', auth, authC.updateProfile);

// SERVICE ROUTES
const serviceR = express.Router();
serviceR.get('/', se.getAllServices);
serviceR.post('/', auth, adminOnly, se.createService);
serviceR.put('/:id', auth, adminOnly, se.updateService);
serviceR.delete('/:id', auth, adminOnly, se.deleteService);

// EMPLOYEE ROUTES
const employeeR = express.Router();
employeeR.get('/', auth, adminOnly, se.getAllEmployees);
employeeR.post('/', auth, adminOnly, se.createEmployee);
employeeR.put('/:id', auth, adminOnly, se.updateEmployee);
employeeR.delete('/:id', auth, adminOnly, se.deleteEmployee);

// CUSTOMER ROUTES
const customerR = express.Router();
customerR.get('/', auth, adminOnly, cust.getAll);
customerR.get('/:id', auth, cust.getOne);
customerR.put('/:id', auth, adminOnly, cust.update);
customerR.delete('/:id', auth, adminOnly, cust.destroy);

// ORDER ROUTES
const orderR = express.Router();
orderR.get('/', auth, adminOnly, ord.getAll);
orderR.get('/my', auth, ord.getMyOrders);
orderR.get('/:id', auth, ord.getOne);
orderR.post('/', auth, adminOnly, ord.create);
orderR.put('/:id/status', auth, adminOnly, ord.updateStatus);
orderR.delete('/:id', auth, adminOnly, ord.destroy);

// PAYMENT ROUTES
const paymentR = express.Router();
paymentR.get('/', auth, adminOnly, oth.getAllPayments);
paymentR.post('/', auth, adminOnly, oth.createPayment);

// EXPENSE ROUTES
const expenseR = express.Router();
expenseR.get('/', auth, adminOnly, oth.getAllExpenses);
expenseR.post('/', auth, adminOnly, oth.createExpense);
expenseR.delete('/:id', auth, adminOnly, oth.deleteExpense);

// NOTIFICATION ROUTES
const notifR = express.Router();
notifR.get('/', auth, oth.getMyNotifications);
notifR.put('/:id/read', auth, oth.readNotification);

// DASHBOARD ROUTE
const dashR = express.Router();
dashR.get('/summary', auth, adminOnly, oth.getDashboard);

module.exports = { authR, serviceR, employeeR, customerR, orderR, paymentR, expenseR, notifR, dashR };
