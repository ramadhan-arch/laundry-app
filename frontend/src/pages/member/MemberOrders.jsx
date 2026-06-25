import { useEffect, useState } from 'react';
import MemberNavbar from '../../components/member/MemberNavbar';
import { useOrder } from '../../context/OrderContext';
import { createPayment } from '../../services/api';
import Swal from 'sweetalert2';

const statusLabel = { 
  pending: 'Menunggu Konfirmasi', 
  waiting_pickup: 'Menunggu Jemput 🛵',
  pickup_process: 'Kurir Menuju Rumahmu 🧭',
  processing: 'Sedang Diproses', 
  washing: 'Sedang Dicuci', 
  drying: 'Dikeringkan', 
  ironing: 'Disetrika', 
  done: 'Selesai ✨', 
  delivery_process: 'Sedang Diantar Kurir 🚚',
  delivered: 'Sudah Diterima ✅', 
  cancelled: 'Dibatalkan ❌' 
};

const statusColor = { 
  pending: '#D97706', waiting_pickup: '#0284C7', pickup_process: '#2563EB',
  processing: '#2563EB', washing: '#2563EB', drying: '#2563EB', 
  ironing: '#7C3AED', done: '#16A34A', delivery_process: '#7C3AED',
  delivered: '#16A34A', cancelled: '#DC2626' 
};

const statusBg = { 
  pending: '#FEF3C7', waiting_pickup: '#E0F2FE', pickup_process: '#DBEAFE',
  processing: '#DBEAFE', washing: '#DBEAFE', drying: '#DBEAFE', 
  ironing: '#EDE9FE', done: '#DCFCE7', delivery_process: '#EDE9FE',
  delivered: '#DCFCE7', cancelled: '#FEE2E2' 
};

const statusIcon = { 
  pending: '⏳', waiting_pickup: '🛵', pickup_process: '🧭',
  processing: '⚙️', washing: '🫧', drying: '💨', 
  ironing: '👔', done: '✅', delivery_process: '🚚',
  delivered: '📦', cancelled: '❌' 
};

const deliveryMethodLabel = {
  drop_off_pickup_self: 'Sewa Mandiri (Drop Off)',
  pickup_only: 'Minta Jemput',
  delivery_only: 'Minta Antar',
  shuttle: 'Antar Jemput (Full)'
};

const paymentMethodLabel = {
  cash: 'Tunai (Cash)',
  transfer: 'Transfer Bank',
  qris: 'QRIS Digital'
};

const statusSteps = ['pending', 'waiting_pickup', 'pickup_process', 'processing', 'washing', 'drying', 'ironing', 'done', 'delivery_process'];

export default function MemberOrders() {
  const { myOrders, loading, fetchMyOrders, invalidateOrders } = useOrder();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchMyOrders(); }, []);

  const handleRefresh = () => { invalidateOrders(); fetchMyOrders(true); };

  // FITUR BARU: Handler fungsi simulasi pembayaran langsung dari sisi member
  const handleSimulatePayment = async (order) => {
    const { value: formValues } = await Swal.fire({
      title: 'Simulasi Pembayaran Mandiri 💳',
      html: `
        <div style="text-align: left; font-family: 'Inter', sans-serif;">
          <p style="font-size: 13px; color: #6B7280; margin-bottom: 12px;">Silakan pilih metode simulasi pelunasan untuk tagihan sebesar <strong>Rp ${Number(order.total_amount).toLocaleString('id-ID')}</strong></p>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Metode Transaksi</label>
          <select id="swal-method" class="swal2-input" style="width: 100%; margin: 0 0 14px 0; font-size: 14px; height: 42px; border-radius: 8px;">
            <option value="qris">QRIS Digital (Auto Settlement)</option>
            <option value="transfer">Transfer Bank (Virtual Account)</option>
            <option value="cash">Tunai via Driver/Kasir</option>
          </select>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Catatan Tambahan</label>
          <input id="swal-notes" class="swal2-input" placeholder="Contoh: Pembayaran sukses simulasi member" style="width: 100%; margin: 0; font-size: 14px; height: 42px; border-radius: 8px;">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Konfirmasi Bayar ✅',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#16A34A',
      preConfirm: () => {
        return {
          method: document.getElementById('swal-method').value,
          notes: document.getElementById('swal-notes').value || 'Lunas via simulasi pelanggan mandiri'
        }
      }
    });

    if (formValues) {
      try {
        Swal.fire({ title: 'Memproses Pembayaran...', didOpen: () => Swal.showLoading() });
        
        // Tembak langsung API create payment
        await createPayment({
          order_id: order.id,
          amount: order.total_amount,
          method: formValues.method,
          notes: formValues.notes
        });

        Swal.fire({
          title: 'Pembayaran Sukses! 🎉',
          text: `Tagihan untuk order ${order.order_code} berhasil dilunasi secara real-time.`,
          icon: 'success',
          confirmButtonColor: '#1D4ED8'
        });

        // Hancurkan cache global dan fetch data terbaru agar struk digital langsung pecah/terpampang
        invalidateOrders();
        fetchMyOrders(true);
        setSelected(null);
      } catch (err) {
        Swal.fire({
          title: 'Gagal Memproses ❌',
          text: err.response?.data?.message || 'Terjadi kesalahan sistem.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        });
      }
    }
  };

  const tabs = [
    { key: 'all', label: 'Semua', count: myOrders.length },
    { key: 'active', label: 'Aktif', count: myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length },
    { key: 'done', label: 'Selesai', count: myOrders.filter(o => ['delivered'].includes(o.status)).length },
    { key: 'unpaid', label: 'Belum Bayar', count: myOrders.filter(o => o.payment_status === 'unpaid' && o.status !== 'cancelled').length },
  ];

  const filtered = myOrders.filter(o => {
    if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status);
    if (filter === 'done') return ['delivered'].includes(o.status);
    if (filter === 'unpaid') return o.payment_status === 'unpaid' && o.status !== 'cancelled';
    return true;
  });

  return (
    <div style={{ background: '#F8F7F4', minHeight: '100vh', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <MemberNavbar />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Order Saya</h1>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 3 }}>Pantau status cucian kamu di sini</p>
          </div>
          <button onClick={handleRefresh}
            style={{ fontSize: 13, color: '#1D4ED8', background: '#EFF6FF', border: '0.5px solid #BFDBFE', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}>
            🔄 Refresh
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: '0.5px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
                borderColor: filter === t.key ? '#1D4ED8' : 'rgba(0,0,0,0.1)',
                background: filter === t.key ? '#1D4ED8' : '#fff',
                color: filter === t.key ? '#fff' : '#6B6B6B'
              }}>
              {t.label}
              {t.count > 0 && (
                <span style={{ fontSize: 11, background: filter === t.key ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ display: 'inline-block', width: 24, height: 24, border: '2.5px solid #1D4ED8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: 12, fontSize: 13, color: '#9CA3AF' }}>Memuat order...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>🧺</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Belum ada order</div>
            <div style={{ fontSize: 14, color: '#9CA3AF' }}>Silakan buat pesanan laundry baru melalui menu Beranda.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(o => (
              <div key={o.id} onClick={() => setSelected(selected?.id === o.id ? null : o)}
                style={{ background: '#fff', border: `0.5px solid ${selected?.id === o.id ? '#1D4ED8' : 'rgba(0,0,0,0.07)'}`, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (selected?.id !== o.id) e.currentTarget.style.borderColor = '#93C5FD'; }}
                onMouseLeave={e => { if (selected?.id !== o.id) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)'; }}>

                <div style={{ height: 4, background: statusColor[o.status] || '#ccc' }} />

                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: statusBg[o.status] || '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                        {statusIcon[o.status] || '📦'}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{o.order_code}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                          {new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: statusBg[o.status] || '#f3f4f6', color: statusColor[o.status] || '#1f2937', fontWeight: 700, display: 'block', marginBottom: 5 }}>
                        {statusLabel[o.status] || o.status}
                      </span>
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: o.payment_status === 'paid' ? '#DCFCE7' : '#FEF3C7', color: o.payment_status === 'paid' ? '#16A34A' : '#D97706', fontWeight: 600 }}>
                        {o.payment_status === 'paid' ? '✓ Lunas' : 'Belum Bayar'}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 14, padding: '10px 14px', background: '#F8F7F4', borderRadius: 10 }}>
                    {o.OrderItems && o.OrderItems.length > 0 
                      ? `🧺 ${o.OrderItems.map(i => `${i.Service?.name} (${i.quantity} ${i.Service?.unit || 'unit'})`).join(' · ')}`
                      : '🧺 Detail item sedang dihitung di kasir...'}
                  </div>

                  {!['cancelled', 'delivered'].includes(o.status) && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                        {statusSteps.map((s, idx) => {
                          const cur = statusSteps.indexOf(o.status);
                          const active = idx <= cur;
                          return (
                            <div key={s} style={{ flex: 1, height: 6, borderRadius: 3, background: active ? (statusColor[o.status] || '#1D4ED8') : '#E5E7EB', transition: 'all 0.4s' }} />
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF' }}>
                        <span>Tgl Order: {o.order_date}</span>
                        <span>Metode: <strong>{deliveryMethodLabel[o.delivery_method] || 'Drop Off'}</strong></span>
                        <span>Estimasi Selesai: {o.estimated_done || '—'}</span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{selected?.id === o.id ? '▲ Tutup detail' : '▼ Lihat detail'}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#1D4ED8' }}>Rp {Number(o.total_amount).toLocaleString('id-ID')}</div>
                  </div>

                  {selected?.id === o.id && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
                      
                      {/* BUKTI PEMBAYARAN DIGITAL (MUNCUL KALAU PAID) */}
                      {o.payment_status === 'paid' && o.Payment && (
                        <div style={{ marginBottom: 18, padding: '16px', background: '#F0FDF4', border: '1px dashed #BBF7D0', borderRadius: 14, position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: 0, right: 16, fontSize: '28px', opacity: 0.08, userSelect: 'none' }}>🧾</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                            <span>✨ Bukti Pembayaran Sah</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 12, color: '#374151' }}>
                            <div>Metode Pembayaran:</div>
                            <div style={{ fontWeight: 600, textAlign: 'right' }}>{paymentMethodLabel[o.Payment.method] || o.Payment.method}</div>
                            <div>Nominal Dibayar:</div>
                            <div style={{ fontWeight: 700, color: '#16A34A', textAlign: 'right' }}>Rp {Number(o.Payment.amount).toLocaleString('id-ID')}</div>
                            <div>Waktu Pelunasan:</div>
                            <div style={{ textAlign: 'right', color: '#6B7280' }}>
                              {new Date(o.Payment.paid_at || o.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {o.Payment.notes && (
                            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '0.5px dashed #D1FAE5', fontSize: 11, color: '#15803D', fontStyle: 'italic' }}>
                              📌 Keterangan: "{o.Payment.notes}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* TOMBOL SIMULASI BAYAR MANDIRI (MUNCUL JIKA UNPAID & TIDAK BATAL) */}
                      {o.payment_status === 'unpaid' && o.status !== 'cancelled' && (
                        <div style={{ marginBottom: 18, padding: '14px', background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#B45309' }}>Simulasi Gerbang Pembayaran</div>
                            <div style={{ fontSize: 11, color: '#D97706', marginTop: 2 }}>Selesaikan tagihan transaksi untuk uji coba resi digital.</div>
                          </div>
                          <button type="button" 
                            onClick={(e) => { e.stopPropagation(); handleSimulatePayment(o); }}
                            style={{ padding: '8px 14px', borderRadius: 10, background: '#D97706', color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(217,119,6,0.2)', flexShrink: 0 }}>
                            Simulasi Bayar Mandiri 💳
                          </button>
                        </div>
                      )}

                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Rincian item & Pengiriman:</div>
                      
                      {o.OrderItems?.map(i => (
                        <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 8, padding: '10px 14px', background: '#F8F7F4', borderRadius: 10 }}>
                          <div>
                            <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{i.Service?.name}</span>
                            <span style={{ color: '#9CA3AF', marginLeft: 8 }}>× {i.quantity} {i.Service?.unit}</span>
                          </div>
                          <span style={{ color: '#1D4ED8', fontWeight: 700 }}>Rp {Number(i.subtotal).toLocaleString('id-ID')}</span>
                        </div>
                      ))}

                      {o.pickup_address && (
                        <div style={{ fontSize: 13, color: '#374151', marginTop: 8, padding: '10px 14px', background: '#F0F9FF', border: '0.5px solid #E0F2FE', borderRadius: 10 }}>
                          📍 <strong>Alamat Jemput:</strong> {o.pickup_address}
                        </div>
                      )}

                      {o.delivery_address && (
                        <div style={{ fontSize: 13, color: '#374151', marginTop: 8, padding: '10px 14px', background: '#F0FDF4', border: '0.5px solid #DCFCE7', borderRadius: 10 }}>
                          🏠 <strong>Alamat Antar:</strong> {o.delivery_address}
                        </div>
                      )}

                      {o.Employee && (
                        <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 8, padding: '10px 14px', background: '#EFF6FF', borderRadius: 10 }}>
                          👨‍💼 <strong>Kurir/Karyawan PJ:</strong> {o.Employee.name} ({o.Employee.position})
                        </div>
                      )}

                      {o.notes && (
                        <div style={{ marginTop: 8, padding: '10px 14px', background: '#FEF3C7', borderRadius: 10, fontSize: 13, color: '#92400E' }}>
                          📝 <strong>Catatan:</strong> {o.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}