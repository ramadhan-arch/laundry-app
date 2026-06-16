import { createContext, useState, useContext, useCallback } from 'react';
import { getOrders, getMyOrders, getServices } from '../services/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── CACHE HELPERS ─────────────────────────────────────
  const saveCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  };

  const loadCache = (key, maxAgeMs = 5 * 60 * 1000) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > maxAgeMs) { localStorage.removeItem(key); return null; }
      return data;
    } catch { return null; }
  };

  const clearCache = (...keys) => keys.forEach(k => localStorage.removeItem(k));

  // ── FETCH ORDERS (admin) ───────────────────────────────
  const fetchOrders = useCallback(async (force = false) => {
    if (!force) {
      const cached = loadCache('cache_orders');
      if (cached) { setOrders(cached); return; }
    }
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res.data);
      saveCache('cache_orders', res.data);
    } catch {}
    setLoading(false);
  }, []);

  // ── FETCH MY ORDERS (member) ───────────────────────────
  const fetchMyOrders = useCallback(async (force = false) => {
    if (!force) {
      const cached = loadCache('cache_my_orders');
      if (cached) { setMyOrders(cached); return; }
    }
    setLoading(true);
    try {
      const res = await getMyOrders();
      setMyOrders(res.data);
      saveCache('cache_my_orders', res.data);
    } catch {}
    setLoading(false);
  }, []);

  // ── FETCH SERVICES ────────────────────────────────────
  const fetchServices = useCallback(async (force = false) => {
    if (!force) {
      const cached = loadCache('cache_services', 10 * 60 * 1000); // 10 menit
      if (cached) { setServices(cached); return; }
    }
    try {
      const res = await getServices();
      setServices(res.data);
      saveCache('cache_services', res.data);
    } catch {}
  }, []);

  // ── INVALIDATE setelah create/update/delete ────────────
  const invalidateOrders = () => {
    clearCache('cache_orders', 'cache_my_orders');
    setOrders([]);
    setMyOrders([]);
  };

  const invalidateServices = () => {
    clearCache('cache_services');
    setServices([]);
  };

  const clearAllCache = () => {
    clearCache('cache_orders', 'cache_my_orders', 'cache_services');
    setOrders([]); setMyOrders([]); setServices([]);
  };

  return (
    <OrderContext.Provider value={{
      orders, myOrders, services, loading,
      fetchOrders, fetchMyOrders, fetchServices,
      invalidateOrders, invalidateServices, clearAllCache,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
