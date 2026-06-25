import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) { localStorage.clear(); window.location.href = '/login'; }
    return Promise.reject(err);
  }
);

export const login = d => api.post('/auth/login', d);
export const register = d => api.post('/auth/register', d);
export const getMe = () => api.get('/auth/me');
export const updateProfile = d => api.put('/auth/profile', d);

export const getServices = () => api.get('/services');
export const createService = d => api.post('/services', d);
export const updateService = (id,d) => api.put(`/services/${id}`, d);
export const deleteService = id => api.delete(`/services/${id}`);

export const getEmployees = () => api.get('/employees');
export const createEmployee = d => api.post('/employees', d);
export const updateEmployee = (id,d) => api.put(`/employees/${id}`, d);
export const deleteEmployee = id => api.delete(`/employees/${id}`);

export const getCustomers = () => api.get('/customers');
export const updateCustomer = (id,d) => api.put(`/customers/${id}`, d);
export const deleteCustomer = id => api.delete(`/customers/${id}`);

export const getOrders = () => api.get('/orders');
export const getMyOrders = () => api.get('/orders/my');
export const getOrder = id => api.get(`/orders/${id}`);
export const createOrder = d => api.post('/orders', d);
export const createMemberOrder = d => api.post('/orders/member', d); // ← KODE BARU AXIOS MEMBER
export const updateOrderStatus = (id,d) => api.put(`/orders/${id}/status`, d);
export const deleteOrder = id => api.delete(`/orders/${id}`);

export const createPayment = d => api.post('/payments', d);
export const getPayments = () => api.get('/payments');

export const getExpenses = () => api.get('/expenses');
export const createExpense = d => api.post('/expenses', d);
export const deleteExpense = id => api.delete(`/expenses/${id}`);

export const getNotifications = () => api.get('/notifications');
export const readNotification = id => api.put(`/notifications/${id}/read`);

export const getDashboard = () => api.get('/dashboard/summary');

export default api;