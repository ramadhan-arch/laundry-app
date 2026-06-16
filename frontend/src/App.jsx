import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import './index.css';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminServices from './pages/admin/AdminServices';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminPayments from './pages/admin/AdminPayments';
import AdminExpenses from './pages/admin/AdminExpenses';

import MemberHome from './pages/member/MemberHome';
import MemberOrders from './pages/member/MemberOrders';
import MemberProfile from './pages/member/MemberProfile';
import MemberNotifications from './pages/member/MemberNotifications';

const GuardAdmin = ({ children }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/member" />;
  return children;
};

const GuardMember = ({ children }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (user?.role !== 'customer') return <Navigate to="/admin" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={<GuardAdmin><AdminDashboard /></GuardAdmin>} />
          <Route path="/admin/orders" element={<GuardAdmin><AdminOrders /></GuardAdmin>} />
          <Route path="/admin/services" element={<GuardAdmin><AdminServices /></GuardAdmin>} />
          <Route path="/admin/customers" element={<GuardAdmin><AdminCustomers /></GuardAdmin>} />
          <Route path="/admin/employees" element={<GuardAdmin><AdminEmployees /></GuardAdmin>} />
          <Route path="/admin/payments" element={<GuardAdmin><AdminPayments /></GuardAdmin>} />
          <Route path="/admin/expenses" element={<GuardAdmin><AdminExpenses /></GuardAdmin>} />

          <Route path="/member" element={<GuardMember><MemberHome /></GuardMember>} />
          <Route path="/member/orders" element={<GuardMember><MemberOrders /></GuardMember>} />
          <Route path="/member/profile" element={<GuardMember><MemberProfile /></GuardMember>} />
          <Route path="/member/notifications" element={<GuardMember><MemberNotifications /></GuardMember>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  );
}
