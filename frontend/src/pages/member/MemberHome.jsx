import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MemberNavbar from '../../components/member/MemberNavbar';
import { useOrder } from '../../context/OrderContext';
import { getMe } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SVC_PHOTOS = {
  'cuci reguler':   'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&q=75',
  'cuci ekspres':   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75',
  'cuci + setrika': 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&q=75',
  'setrika saja':   'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&q=75',
  'cuci sepatu':    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75',
  'dry cleaning':   'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=75',
  'cuci selimut':   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=75',
  'cuci jas/blazer':'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=75',
};

const getMemberServicePhoto = (name, unit) => {
  const key = name?.toLowerCase().trim();
  if (SVC_PHOTOS[key]) return SVC_PHOTOS[key];
  const partial = Object.keys(SVC_PHOTOS).find(k => key?.includes(k) || k.includes(key));
  if (partial) return SVC_PHOTOS[partial];
  return unit === 'kg'
    ? 'https://images.unsplash.com/photo-1626806787461-102c1a7f1b45?w=400&q=75'
    : 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&q=75';
};

const statusLabel = { 
  pending:'Menunggu Proses', 
  waiting_pickup:'Menunggu Penjemputan 🛵', 
  pickup_process:'Kurir Sedang Menjemput 🧭', 
  processing:'Sedang Diproses', 
  washing:'Sedang Dicuci', 
  drying:'Dikeringkan', 
  ironing:'Disetrika', 
  done:'Selesai ✅', 
  delivery_process:'Sedang Diantar Kurir 🚚', 
  delivered:'Sudah Dikirim', 
  cancelled:'Dibatalkan' 
};

const statusColor = { pending:'#D97706', waiting_pickup:'#2563EB', pickup_process:'#2563EB', processing:'#2563EB', washing:'#2563EB', drying:'#2563EB', ironing:'#7C3AED', done:'#16A34A', delivery_process:'#7C3AED', delivered:'#16A34A', cancelled:'#DC2626' };
const statusBg = { pending:'#FEF3C7', waiting_pickup:'#DBEAFE', pickup_process:'#DBEAFE', processing:'#DBEAFE', washing:'#DBEAFE', drying:'#DBEAFE', ironing:'#EDE9FE', done:'#DCFCE7', delivery_process:'#EDE9FE', delivered:'#DCFCE7', cancelled:'#FEE2E2' };
const statusIcon = { pending:'⏳', waiting_pickup:'🛵', pickup_process:'🧭', processing:'⚙️', washing:'🫧', drying:'💨', ironing:'👔', done:'✅', delivery_process:'🚚', delivered:'📦', cancelled:'❌' };

const HERO_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85';

export default function MemberHome() {
  const { user } = useAuth();
  const { myOrders, services, fetchMyOrders, fetchServices, handleCreateMemberOrder } = useOrder();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('drop_off_pickup_self');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchMyOrders(), fetchServices(), getMe().then(r => setProfile(r.data))])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (profile?.User?.address) {
      setPickupAddress(profile.User.address);
      setDeliveryAddress(profile.User.address);
    }
  }, [profile]);

  const activeOrders = myOrders.filter(o => !['done','delivered','cancelled'].includes(o.status));
  const unpaidOrders = myOrders.filter(o => o.payment_status==='unpaid' && o.status!=='cancelled');
  const doneOrders = myOrders.filter(o => ['done','delivered'].includes(o.status));

  const onSubmitOrder = async (e) => {
    e.preventDefault();
    setOrderLoading(true);
    try {
      const payload = {
        items: [{ service_id: selectedService.id, quantity: Number(quantity) }],
        delivery_method: deliveryMethod,
        pickup_address: ['pickup_only', 'shuttle'].includes(deliveryMethod) ? pickupAddress : null,
        delivery_address: ['delivery_only', 'shuttle'].includes(deliveryMethod) ? deliveryAddress : null,
        notes
      };

      await handleCreateMemberOrder(payload);
      alert('Hore! Pesanan laundry kamu berhasil dikirim.');
      setSelectedService(null);
      setQuantity(1);
      setDeliveryMethod('drop_off_pickup_self');
      setNotes('');
      fetchMyOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengirim orderan');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div style={{ background:'#F8F7F4', minHeight:'100vh', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <MemberNavbar />

      <div style={{ position:'relative', height:220, overflow:'hidden' }}>
        <img src={HERO_IMG} alt="Laundry" style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => { e.target.parentElement.style.background='#1D4ED8'; e.target.style.display='none'; }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(17,24,78,0.75)', display:'flex', alignItems:'center', padding:'0 40px' }}>
          <div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', marginBottom:6 }}>Selamat datang kembali 👋</div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'white', letterSpacing:'-0.02em', marginBottom:4 }}>{user?.name}</h1>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>
              Kode Member: <span style={{ color:'#93C5FD', fontWeight:600 }}>{profile?.Customer?.customer_code||'—'}</span>
            </div>
          </div>
          <div style={{ marginLeft:'auto', textAlign:'right' }}>
            <div style={{ fontSize:36, fontWeight:800, color:'white' }}>{myOrders.length}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>Total order</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'24px' }}>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Order Aktif', value:activeOrders.length, icon:'🔄', color:'#1D4ED8', bg:'#DBEAFE', border:'#BFDBFE' },
            { label:'Selesai', value:doneOrders.length, icon:'✅', color:'#15803D', bg:'#DCFCE7', border:'#86EFAC' },
            { label:'Belum Bayar', value:unpaidOrders.length, icon:'💳', color:'#B45309', bg:'#FEF3C7', border:'#FCD34D' },
          ].map(c => (
            <div key={c.label} style={{ background:'#fff', border:`0.5px solid ${c.border}`, borderRadius:16, padding:20, display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize:26, fontWeight:800, color:c.color, letterSpacing:'-0.02em' }}>{c.value}</div>
                <div style={{ fontSize:13, color:'#6B6B6B', marginTop:2 }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {unpaidOrders.length > 0 && (
          <div style={{ background:'#FEF3C7', border:'0.5px solid #FCD34D', borderRadius:14, padding:'14px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:24 }}>⚠️</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#92400E' }}>Kamu punya {unpaidOrders.length} tagihan belum dibayar</div>
              <div style={{ fontSize:13, color:'#B45309', marginTop:2 }}>Silakan hubungi kasir untuk proses pembayaran</div>
            </div>
            <Link to="/member/orders" style={{ marginLeft:'auto', padding:'8px 16px', borderRadius:10, background:'#D97706', color:'white', fontSize:13, fontWeight:600, border:'none', flexShrink:0 }}>Lihat →</Link>
          </div>
        )}

        {activeOrders.length > 0 && (
          <div style={{ background:'#fff', border:'0.5px solid rgba(0,0,0,0.07)', borderRadius:18, padding:22, marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyBetween:'space-between', marginBottom:18 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:'#1a1a1a' }}>🔄 Order sedang berjalan</div>
                <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{activeOrders.length} order aktif</div>
              </div>
              <Link to="/member/orders" style={{ fontSize:13, color:'#1D4ED8', fontWeight:600, border:'0.5px solid #BFDBFE', padding:'6px 14px', borderRadius:10, background:'#EFF6FF' }}>Lihat semua</Link>
            </div>
            {activeOrders.slice(0,3).map(o => (
              <div key={o.id} style={{ display:'flex', alignItems:'center', justifyBetween:'space-between', padding:'14px 0', borderBottom:'0.5px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:statusBg[o.status] || '#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                    {statusIcon[o.status] || '📦'}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{o.order_code}</div>
                    <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{o.OrderItems?.map(i=>i.Service?.name).join(', ')}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontSize:12, padding:'4px 12px', borderRadius:20, background:statusBg[o.status] || '#f3f4f6', color:statusColor[o.status] || '#1f2937', fontWeight:600 }}>{statusLabel[o.status] || o.status}</span>
                  <div style={{ fontSize:13, color:'#1D4ED8', fontWeight:700, marginTop:4 }}>Rp {Number(o.total_amount).toLocaleString('id-ID')}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background:'#fff', border:'0.5px solid rgba(0,0,0,0.07)', borderRadius:18, padding:22 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>🧺 Layanan tersedia</div>
          <div style={{ fontSize:12, color:'#9CA3AF', marginBottom:18 }}>Pilih dan klik layanan di bawah untuk mulai mengorder</div>
          {loading ? (
            <div style={{ textAlign:'center', padding:30 }}><div style={{ display:'inline-block', width:30, height:30, border:'3px solid #1D4ED8', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }} /></div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
              {services.filter(s=>s.is_active).map((s,i) => (
                <div key={s.id} 
                  onClick={() => setSelectedService(s)} 
                  style={{ borderRadius:14, overflow:'hidden', border:'0.5px solid rgba(0,0,0,0.07)', transition:'all 0.2s', cursor:'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='#1D4ED8'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='rgba(0,0,0,0.07)'; }}>
                  <div style={{ height:90, overflow:'hidden', position:'relative' }}>
                    <img src={getMemberServicePhoto(s.name, s.unit)} alt={s.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      onError={e => {
                        if (!e.target.dataset.fallback) {
                          e.target.dataset.fallback = '1';
                          e.target.src = 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&q=75';
                        } else {
                          e.target.style.display='none';
                        }
                      }} />
                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.2)' }} />
                  </div>
                  <div style={{ padding:'12px 14px', background:'#fff' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:2 }}>{s.name}</div>
                    <div style={{ fontSize:11, color:'#9CA3AF', marginBottom:6, minHeight:32 }}>{s.description}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#1D4ED8' }}>
                      Rp {s.unit==='kg'?Number(s.price_per_kg).toLocaleString('id-ID'):Number(s.price_per_item).toLocaleString('id-ID')}/{s.unit}
                    </div>
                    <div style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>⏱ {s.estimated_days} hari</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedService && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:16 }}>
          <div style={{ background:'white', borderRadius:20, width:'100%', maxWidth:480, overflow:'hidden', boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ background:'#1D4ED8', padding:'18px 24px', color:'white', display:'flex', justifyBetween:'center', alignItems:'center' }}>
              <div>
                <h3 style={{ fontSize:16, fontWeight:700, margin:0 }}>Formulir Order Baru</h3>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.75)', margin:'2px 0 0 0' }}>Layanan: {selectedService.name}</p>
              </div>
              <button onClick={() => setSelectedService(null)} style={{ background:'transparent', border:'none', color:'white', fontSize:20, cursor:'pointer', marginLeft:'auto' }}>✕</button>
            </div>

            <form onSubmit={onSubmitOrder} style={{ padding:24, display:'flex', flexDirection:'column', gap:16, maxHeight:'80vh', overflowY:'auto' }}>
              
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Estimasi Jumlah ({selectedService.unit})</label>
                <input type="number" min="1" step="0.1" value={quantity} onChange={e => setQuantity(e.target.value)} required
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #D1D5DB', fontSize:14, color:'#1a1a1a' }} />
                <p style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>*Jumlah real akan dihitung ulang secara akurat saat pakaian tiba di kasir outlet.</p>
              </div>

              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Metode Pengantaran & Jemput</label>
                {/* FIX PERBAIKAN WARNA TEKS TAMBAHKAN color:'#1a1a1a' DI BAWAH INI */}
                <select value={deliveryMethod} onChange={e => setDeliveryMethod(e.target.value)}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #D1D5DB', fontSize:14, background:'white', color:'#1a1a1a' }}>
                  <option value="drop_off_pickup_self">Antar & Ambil Sendiri ke Outlet</option>
                  <option value="pickup_only">Minta Di-Jemput Saja oleh Kurir</option>
                  <option value="delivery_only">Minta Di-Antar Saja oleh Kurir</option>
                  <option value="shuttle">Paket Lengkap Antar-Jemput (Shuttle)</option>
                </select>
              </div>

              {['pickup_only', 'shuttle'].includes(deliveryMethod) && (
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>🏠 Alamat Penjemputan Baju</label>
                  <textarea value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} required placeholder="Tulis alamat lengkap penjemputan..."
                    style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #D1D5DB', fontSize:14, minHeight:60, fontFamily:'inherit', color:'#1a1a1a' }} />
                </div>
              )}

              {['delivery_only', 'shuttle'].includes(deliveryMethod) && (
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>📍 Alamat Pengantaran (Setelah Bersih)</label>
                  <textarea value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} required placeholder="Tulis alamat lengkap pengiriman baju..."
                    style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #D1D5DB', fontSize:14, minHeight:60, fontFamily:'inherit', color:'#1a1a1a' }} />
                </div>
              )}

              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Catatan Tambahan (Opsional)</label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Contoh: Baju luntur dipisah, noda tinta di kerah"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #D1D5DB', fontSize:14, color:'#1a1a1a' }} />
              </div>

              <div style={{ background:'#F3F4F6', borderRadius:12, padding:14, marginTop:8 }}>
                <div style={{ display:'flex', justifyBetween:'space-between', fontSize:13, color:'#4B5563' }}>
                  <span>Estimasi Tarif Laundry:</span>
                  <span style={{ fontWeight: 700 }}>
                    Rp {Number((selectedService.unit === 'kg' ? selectedService.price_per_kg : selectedService.price_per_item) * quantity).toLocaleString('id-ID')}
                  </span>
                </div>
                <div style={{ display:'flex', justifyBetween:'space-between', fontSize:12, color:'#9CA3AF', marginTop:4 }}>
                  <span>Biaya Kurir:</span>
                  <span>{deliveryMethod === 'drop_off_pickup_self' ? 'Gratis' : 'Dihitung Saat Konfirmasi'}</span>
                </div>
              </div>

              <div style={{ display:'flex', gap:10, marginTop:12 }}>
                <button type="button" onClick={() => setSelectedService(null)} disabled={orderLoading}
                  style={{ flex:1, padding:'12px', borderRadius:10, border:'1px solid #D1D5DB', background:'white', color:'#4B5563', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                  Batal
                </button>
                <button type="submit" disabled={orderLoading}
                  style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:'#1D4ED8', color:'white', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                  {orderLoading ? 'Mengirim...' : 'Kirim Orderan 🚀'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}