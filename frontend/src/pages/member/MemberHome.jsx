import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MemberNavbar from '../../components/member/MemberNavbar';
import { useOrder } from '../../context/OrderContext';
import { getMe } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Foto sesuai nama layanan
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

const statusLabel = { pending:'Menunggu Proses', processing:'Sedang Diproses', washing:'Sedang Dicuci', drying:'Dikeringkan', ironing:'Disetrika', done:'Selesai ✅', delivered:'Sudah Dikirim', cancelled:'Dibatalkan' };
const statusColor = { pending:'#D97706', processing:'#2563EB', washing:'#2563EB', drying:'#2563EB', ironing:'#7C3AED', done:'#16A34A', delivered:'#16A34A', cancelled:'#DC2626' };
const statusBg = { pending:'#FEF3C7', processing:'#DBEAFE', washing:'#DBEAFE', drying:'#DBEAFE', ironing:'#EDE9FE', done:'#DCFCE7', delivered:'#DCFCE7', cancelled:'#FEE2E2' };
const statusIcon = { pending:'⏳', processing:'⚙️', washing:'🫧', drying:'💨', ironing:'👔', done:'✅', delivered:'🚚', cancelled:'❌' };

const HERO_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85';

export default function MemberHome() {
  const { user } = useAuth();
  const { myOrders, services, fetchMyOrders, fetchServices } = useOrder();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMyOrders(), fetchServices(), getMe().then(r => setProfile(r.data))])
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = myOrders.filter(o => !['done','delivered','cancelled'].includes(o.status));
  const unpaidOrders = myOrders.filter(o => o.payment_status==='unpaid' && o.status!=='cancelled');
  const doneOrders = myOrders.filter(o => ['done','delivered'].includes(o.status));

  return (
    <div style={{ background:'#F8F7F4', minHeight:'100vh', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <MemberNavbar />

      {/* HERO */}
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

        {/* STAT CARDS */}
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

        {/* UNPAID ALERT */}
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

        {/* ACTIVE ORDERS */}
        {activeOrders.length > 0 && (
          <div style={{ background:'#fff', border:'0.5px solid rgba(0,0,0,0.07)', borderRadius:18, padding:22, marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:'#1a1a1a' }}>🔄 Order sedang berjalan</div>
                <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{activeOrders.length} order aktif</div>
              </div>
              <Link to="/member/orders" style={{ fontSize:13, color:'#1D4ED8', fontWeight:600, border:'0.5px solid #BFDBFE', padding:'6px 14px', borderRadius:10, background:'#EFF6FF' }}>Lihat semua</Link>
            </div>
            {activeOrders.slice(0,3).map(o => (
              <div key={o.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'0.5px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:statusBg[o.status], display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                    {statusIcon[o.status]}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{o.order_code}</div>
                    <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{o.OrderItems?.map(i=>i.Service?.name).join(', ')}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontSize:12, padding:'4px 12px', borderRadius:20, background:statusBg[o.status], color:statusColor[o.status], fontWeight:600 }}>{statusLabel[o.status]}</span>
                  <div style={{ fontSize:13, color:'#1D4ED8', fontWeight:700, marginTop:4 }}>Rp {Number(o.total_amount).toLocaleString('id-ID')}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SERVICES */}
        <div style={{ background:'#fff', border:'0.5px solid rgba(0,0,0,0.07)', borderRadius:18, padding:22 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'#1a1a1a', marginBottom:4 }}>🧺 Layanan tersedia</div>
          <div style={{ fontSize:12, color:'#9CA3AF', marginBottom:18 }}>Pilih layanan sesuai kebutuhan</div>
          {loading ? (
            <div style={{ textAlign:'center', padding:30 }}><div className="spin" style={{ borderTopColor:'#1D4ED8', borderColor:'rgba(29,78,216,0.15)' }} /></div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
              {services.filter(s=>s.is_active).map((s,i) => (
                <div key={s.id} style={{ borderRadius:14, overflow:'hidden', border:'0.5px solid rgba(0,0,0,0.07)', transition:'all 0.2s', cursor:'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='#BFDBFE'; }}
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
                    <div style={{ fontSize:11, color:'#9CA3AF', marginBottom:6 }}>{s.description}</div>
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
    </div>
  );
}
