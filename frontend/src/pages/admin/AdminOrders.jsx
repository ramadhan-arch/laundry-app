
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useOrder } from '../../context/OrderContext';
import { getCustomers, getEmployees, createOrder, updateOrderStatus, createPayment, deleteOrder } from '../../services/api';

const statusList = ['pending', 'waiting_pickup', 'pickup_process', 'processing', 'washing', 'drying', 'ironing', 'done', 'delivery_process', 'delivered', 'cancelled'];

// Peta label — semua key lowercase, termasuk variasi dengan spasi & dash sebagai fallback
const statusLabelMap = {
  'pending':           'Menunggu',
  'waiting_pickup':    'Butuh Jemput 🛵',
  'waiting pickup':    'Butuh Jemput 🛵',
  'waiting-pickup':    'Butuh Jemput 🛵',
  'pickup_process':    'Proses Jemput 🧭',
  'pickup process':    'Proses Jemput 🧭',
  'pickup-process':    'Proses Jemput 🧭',
  'processing':        'Diproses',
  'washing':           'Dicuci',
  'drying':            'Dikeringkan',
  'ironing':           'Disetrika',
  'done':              'Selesai Cuci',
  'delivery_process':  'Proses Antar 🚚',
  'delivery process':  'Proses Antar 🚚',
  'delivery-process':  'Proses Antar 🚚',
  'delivered':         'Terkirim ✅',
  'cancelled':         'Batal ❌',
};

// Helper: normalisasi status dari backend apapun formatnya
const normalizeStatus = (raw) => String(raw || '').toLowerCase().trim();

// Helper: ambil label, fallback ke raw status kalau tidak ketemu
const getStatusLabel = (raw) => {
  const key = normalizeStatus(raw);
  return statusLabelMap[key] || raw || '—';
};

// Helper: warna badge berdasarkan status
const getBadgeStyle = (raw) => {
  const s = normalizeStatus(raw);
  if (s === 'waiting_pickup' || s === 'waiting pickup' || s === 'waiting-pickup' ||
      s === 'pickup_process'  || s === 'pickup process'  || s === 'pickup-process') {
    return { color: '#3B82F6', background: 'rgba(59,130,246,0.18)' };
  }
  if (s === 'delivery_process' || s === 'delivery process' || s === 'delivery-process') {
    return { color: '#8B5CF6', background: 'rgba(139,92,246,0.18)' };
  }
  if (s === 'pending') {
    return { color: '#F59E0B', background: 'rgba(245,158,11,0.18)' };
  }
  if (s === 'cancelled') {
    return { color: '#EF4444', background: 'rgba(239,68,68,0.18)' };
  }
  return { color: '#10B981', background: 'rgba(16,185,129,0.18)' };
};

const deliveryMethodLabel = {
  drop_off_pickup_self: 'Sewa Mandiri (Drop Off)',
  pickup_only: 'Minta Jemput',
  delivery_only: 'Minta Antar',
  shuttle: 'Antar Jemput (Full)'
};

const darkInput = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '0.5px solid rgba(255,255,255,0.1)', background: '#16162a',
  color: 'white', fontSize: 13, outline: 'none', colorScheme: 'dark'
};

export default function AdminOrders() {
  const { orders, services, loading, fetchOrders, fetchServices, invalidateOrders } = useOrder();
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_id: '', employee_id: '', notes: '', items: [{ service_id: '', quantity: 1 }] });
  const [msg, setMsg] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ method: 'cash', notes: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchServices();
    getCustomers().then(r => setCustomers(r.data));
    getEmployees().then(r => setEmployees(r.data));
  }, []);

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { service_id: '', quantity: 1 }] }));
  const removeItem = i => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, k, v) => setForm(f => { const items = [...f.items]; items[i] = { ...items[i], [k]: v }; return { ...f, items }; });

  const calcTotal = () => form.items.reduce((acc, item) => {
    const svc = services.find(s => s.id === Number(item.service_id));
    if (!svc || !item.quantity) return acc;
    const price = svc.unit === 'kg' ? Number(svc.price_per_kg) : Number(svc.price_per_item);
    return acc + price * Number(item.quantity);
  }, 0);

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await createOrder({ ...form, items: form.items.filter(i => i.service_id) });
      setMsg('Order berhasil dibuat!');
      setShowForm(false);
      setForm({ customer_id: '', employee_id: '', notes: '', items: [{ service_id: '', quantity: 1 }] });
      invalidateOrders();
      fetchOrders(true);
    } catch (err) { setMsg(err.response?.data?.message || 'Gagal'); }
  };

  const handleStatus = async () => {
    try {
      await updateOrderStatus(statusModal.id, { status: statusModal.next });
      setStatusModal(null);
      invalidateOrders();
      fetchOrders(true);
    } catch {}
  };

  const handlePay = async () => {
    try {
      await createPayment({ order_id: payModal.id, amount: payModal.total_amount, ...payForm });
      setPayModal(null);
      invalidateOrders();
      fetchOrders(true);
    } catch {}
  };

  const filtered = orders.filter(o =>
    o.order_code?.toLowerCase().includes(search.toLowerCase()) ||
    o.Customer?.User?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Order Laundry" subtitle="Kelola semua transaksi laundry"
      action={
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: '#6C9CF8', color: 'white', fontSize: 13, fontWeight: 500 }}>
          + Buat Order
        </button>
      }>

      {msg && (
        <div style={{ background: 'rgba(29,158,117,0.15)', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 8, padding: '10px 14px', color: '#1D9E75', fontSize: 13, marginBottom: 16 }}>
          {msg}
        </div>
      )}

      {showForm && (
        <div style={{ background: '#13131a', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ color: 'white', fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Buat Order Baru</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 5 }}>Pelanggan</label>
                <select style={darkInput} value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })}>
                  <option value="">Pilih pelanggan</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.User?.name} — {c.customer_code}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 5 }}>Karyawan</label>
                <select style={darkInput} value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })}>
                  <option value="">Pilih karyawan (opsional)</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8 }}>Item Laundry</label>
              {form.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                  <select style={{ ...darkInput, flex: 2 }} value={item.service_id} onChange={e => updateItem(idx, 'service_id', e.target.value)}>
                    <option value="">Pilih layanan</option>
                    {services.filter(s => s.is_active).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} — Rp {s.unit === 'kg' ? Number(s.price_per_kg).toLocaleString('id-ID') : Number(s.price_per_item).toLocaleString('id-ID')}/{s.unit}
                      </option>
                    ))}
                  </select>
                  <input type="number" min="0.5" step="0.5" style={{ ...darkInput, flex: 1 }} value={item.quantity}
                    onChange={e => updateItem(idx, 'quantity', e.target.value)} placeholder="Qty" />
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)}
                      style={{ padding: '8px', background: 'rgba(226,75,74,0.15)', border: 'none', borderRadius: 8, color: '#E24B4A', fontSize: 14 }}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addItem}
                style={{ fontSize: 12, color: '#6C9CF8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>+ Tambah item</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 5 }}>Catatan</label>
              <textarea style={{ ...darkInput, height: 60, resize: 'none' }} value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Catatan tambahan..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Total: Rp {calcTotal().toLocaleString('id-ID')}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Batal</button>
                <button type="submit"
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#6C9CF8', color: 'white', fontSize: 13, fontWeight: 500 }}>Simpan Order</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kode order atau nama pelanggan..."
          style={{ padding: '9px 14px', borderRadius: 10, border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 13, outline: 'none', width: 320 }} />
      </div>

      <div style={{ background: '#13131a', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><div className="spin" /></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                {['Kode', 'Pelanggan & Alamat', 'Layanan', 'Total', 'Status', 'Bayar', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const badgeStyle = getBadgeStyle(o.status);
                const label = getStatusLabel(o.status);

                return (
                  <tr key={o.id} style={{ borderBottom: '0.5px solid rgba(255,255,255,0.04)', verticalAlign: 'top' }}>
                    <td style={{ padding: '16px 14px', fontSize: 12, color: '#6C9CF8', fontWeight: 500 }}>
                      {o.order_code}
                      <div style={{ fontSize: 10, color: o.delivery_method !== 'drop_off_pickup_self' ? '#6C9CF8' : 'rgba(255,255,255,0.25)', marginTop: 4, fontWeight: 400 }}>
                        🚀 {deliveryMethodLabel[o.delivery_method] || 'Drop Off'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ fontSize: 13, color: 'white' }}>{o.Customer?.User?.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{o.Customer?.User?.phone}</div>
                      {o.pickup_address && (
                        <div style={{ fontSize: 11, color: '#E2A84A', marginTop: 6, maxWidth: 240, lineHeight: 1.4 }}>
                          ├ 🛵 <strong>Jemput:</strong> {o.pickup_address}
                        </div>
                      )}
                      {o.delivery_address && (
                        <div style={{ fontSize: 11, color: '#1D9E75', marginTop: 4, maxWidth: 240, lineHeight: 1.4 }}>
                          └ 🏠 <strong>Antar:</strong> {o.delivery_address}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)', maxWidth: 150 }}>
                      {o.OrderItems?.map(i => `${i.Service?.name} (${i.quantity} ${i.Service?.unit})`).join(', ')}
                      {o.notes && <div style={{ fontSize: 11, color: '#E24B4A', marginTop: 6 }}>📝 "{o.notes}"</div>}
                    </td>
                    <td style={{ padding: '16px 14px', fontSize: 13, color: 'white', fontWeight: 500 }}>
                      Rp {Number(o.total_amount).toLocaleString('id-ID')}
                    </td>

                    {/* BADGE STATUS */}
                    <td style={{ padding: '16px 14px', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '5px 12px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        border: 'none',
                        color: badgeStyle.color,
                        background: badgeStyle.background,
                      }}>
                        {label}
                      </span>
                    </td>

                    <td style={{ padding: '16px 14px' }}>
                      <span className={`badge badge-${o.payment_status}`}>
                        {o.payment_status === 'paid' ? 'Lunas' : 'Belum'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setStatusModal({ id: o.id, code: o.order_code, status: o.status, next: o.status })}
                          style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: 'rgba(108,156,248,0.15)', color: '#6C9CF8', fontSize: 11 }}>Status</button>
                        {o.payment_status === 'unpaid' && o.status !== 'cancelled' && (
                          <button onClick={() => setPayModal(o)}
                            style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: 'rgba(29,158,117,0.15)', color: '#1D9E75', fontSize: 11 }}>Bayar</button>
                        )}
                        <button onClick={async () => {
                          if (window.confirm('Hapus order?')) {
                            await deleteOrder(o.id);
                            invalidateOrders();
                            fetchOrders(true);
                          }
                        }} style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: 'rgba(226,75,74,0.12)', color: '#E24B4A', fontSize: 11 }}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && !filtered.length && (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Belum ada order</div>
        )}
      </div>

      {/* STATUS MODAL */}
      {statusModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={() => setStatusModal(null)}>
          <div style={{ background: '#13131a', borderRadius: 14, padding: 24, width: 460, border: '0.5px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'white', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Update Status Pelacakan</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 16 }}>{statusModal.code}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {statusList.map(s => (
                <button key={s} onClick={() => setStatusModal({ ...statusModal, next: s })}
                  style={{
                    padding: '7px 14px', borderRadius: 8, border: '0.5px solid',
                    borderColor: statusModal.next === s ? '#6C9CF8' : 'rgba(255,255,255,0.1)',
                    background: statusModal.next === s ? 'rgba(108,156,248,0.15)' : 'transparent',
                    color: statusModal.next === s ? '#6C9CF8' : 'rgba(255,255,255,0.45)',
                    fontSize: 12
                  }}>
                  {statusLabelMap[s] || s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setStatusModal(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Batal</button>
              <button onClick={handleStatus}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#6C9CF8', color: 'white', fontSize: 13 }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* PAY MODAL */}
      {payModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={() => setPayModal(null)}>
          <div style={{ background: '#13131a', borderRadius: 14, padding: 24, width: 360, border: '0.5px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'white', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Proses Pembayaran</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 16 }}>{payModal.order_code}</p>
            <div style={{ background: 'rgba(29,158,11,0.1)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1D9E75' }}>Rp {Number(payModal.total_amount).toLocaleString('id-ID')}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Total yang harus dibayar</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 5 }}>Metode Pembayaran</label>
              <select style={darkInput} value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer Bank</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 5 }}>Catatan</label>
              <input style={darkInput} value={payForm.notes} onChange={e => setPayForm({ ...payForm, notes: e.target.value })} placeholder="Catatan pembayaran..." />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setPayModal(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Batal</button>
              <button onClick={handlePay}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#1D9E75', color: 'white', fontSize: 13 }}>Konfirmasi Lunas</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}