// Pages Admin: LaundryKu (Fixed Syntax Error)
// Dikerjakan oleh: Clara Ragil Dewanti
// NIM: 2410501116
// Tanggal: 16 Juni 2026

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CACHE_KEY = 'cache_dashboard';
const CACHE_TTL = 3 * 60 * 1000;

const statusLabel = { 
  pending: 'Menunggu', 
  waiting_pickup: 'Butuh Jemput 🛵',
  pickup_process: 'Proses Jemput 🧭',
  processing: 'Diproses', 
  washing: 'Dicuci', 
  drying: 'Dikeringkan', 
  ironing: 'Disetrika', 
  done: 'Selesai Cuci', 
  delivery_process: 'Proses Antar 🚚',
  delivered: 'Terkirim', 
  cancelled: 'Batal' 
};

const statusColor = { 
  pending: '#F59E0B', 
  waiting_pickup: '#3B82F6',
  pickup_process: '#3B82F6',
  processing: '#3B82F6', 
  washing: '#3B82F6', 
  drying: '#3B82F6', 
  ironing: '#8B5CF6', 
  done: '#10B981', 
  delivery_process: '#8B5CF6',
  delivered: '#10B981', 
  cancelled: '#EF4444' 
};

const statusBg = { 
  pending: 'rgba(245,158,11,0.15)', 
  waiting_pickup: 'rgba(59,130,246,0.15)',
  pickup_process: 'rgba(59,130,246,0.15)',
  processing: 'rgba(59,130,246,0.15)', 
  washing: 'rgba(59,130,246,0.15)', 
  drying: 'rgba(59,130,246,0.15)', 
  ironing: 'rgba(139,92,246,0.15)', 
  done: 'rgba(16,185,129,0.15)', 
  delivery_process: 'rgba(139,92,246,0.15)',
  delivered: 'rgba(16,185,129,0.15)', 
  cancelled: 'rgba(239,68,68,0.15)' 
};

const card = { background:'#111118', border:'0.5px solid rgba(255,255,255,0.06)', borderRadius:16 };

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cacheInfo, setCacheInfo] = useState('');

  const loadData = async (force=false) => {
    setLoading(true);
    if (!force) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const { data:cached, ts } = JSON.parse(raw);
          if (Date.now() - ts < CACHE_TTL) {
            setData(cached);
            setCacheInfo('cache • ' + new Date(ts).toLocaleTimeString('id-ID'));
            setLoading(false); return;
          }
        }
      } catch {}
    }
    try {
      const res = await getDashboard();
      setData(res.data);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data:res.data, ts:Date.now() }));
      setCacheInfo('server • ' + new Date().toLocaleTimeString('id-ID'));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const greetTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const pickupQueueCount = data?.recentOrders?.filter(o => o.status === 'waiting_pickup').length || 0;

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:400, gap:16 }}>
        <div style={{ display:'inline-block', width:28, height:28, border:'3px solid #6C9CF8', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
        <div style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>Memuat data dashboard...</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Dashboard" subtitle={new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}>

      {/* GREETING */}
      <div style={{ ...card, padding:'24px 28px', marginBottom:20, background:'linear-gradient(135deg,rgba(29,78,216,0.2),rgba(59,130,246,0.1))', border:'0.5px solid rgba(29,78,216,0.2)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:4 }}>{greetTime()},</div>
          <div style={{ fontSize:22, fontWeight:700, color:'white', letterSpacing:'-0.02em' }}>{user?.name} 👋</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginTop:4 }}>Berikut ringkasan aktivitas laundry hari ini</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.05)', padding:'4px 10px', borderRadius:20 }}>🗄️ {cacheInfo}</div>
          <button onClick={() => loadData(true)} style={{ fontSize:12, color:'#93B4FC', background:'rgba(29,78,216,0.2)', border:'0.5px solid rgba(29,78,216,0.3)', borderRadius:8, padding:'6px 12px', cursor:'pointer' }}>🔄 Refresh</button>
        </div>
      </div>

      {/* COURIER ALERT BAR */}
      {pickupQueueCount > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 18 }}>🛵</div>
          <div style={{ fontSize: 13, color: '#F59E0B' }}>
            Ada <strong>{pickupQueueCount} orderan member baru</strong> yang membutuhkan penjemputan pakaian oleh kurir!
          </div>
          <Link to="/admin/orders" style={{ marginLeft: 'auto', fontSize: 12, color: '#6C9CF8', fontWeight: 600, textDecoration: 'none' }}>
            Proses Kurir →
          </Link>
        </div>
      )}

      {/* STAT CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Total Order', value:data?.totalOrders||0, icon:'📋', color:'#3B82F6', bg:'rgba(59,130,246,0.15)', sub:`${data?.pendingOrders||0} menunggu` },
          { label:'Total Pelanggan', value:data?.totalCustomers||0, icon:'👥', color:'#10B981', bg:'rgba(16,185,129,0.15)', sub:'Member aktif' },
          { label:'Sedang Diproses', value:data?.processingOrders||0, icon:'⚙️', color:'#8B5CF6', bg:'rgba(139,92,246,0.15)', sub:'Order berjalan' },
          { label:'Belum Bayar', value:data?.unpaidOrders||0, icon:'💳', color:'#F59E0B', bg:'rgba(245,158,11,0.15)', sub:'Perlu diproses' },
        ].map(c => (
          <div key={c.label} style={{ ...card, padding:20, transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{c.icon}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.05)', padding:'3px 8px', borderRadius:20 }}>{c.sub}</div>
            </div>
            <div style={{ fontSize:28, fontWeight:800, color:'white', letterSpacing:'-0.02em', marginBottom:4 }}>{c.value}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* INCOME ROW */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Total Pendapatan', value:`Rp ${Number(data?.totalRevenue||0).toLocaleString('id-ID')}`, icon:'💰', color:'#10B981' },
          { label:'Total Pengeluaran', value:`Rp ${Number(data?.totalExpenses||0).toLocaleString('id-ID')}`, icon:'📊', color:'#F59E0B' },
          { label:'Net Income', value:`Rp ${Number(data?.netIncome||0).toLocaleString('id-ID')}`, icon:'📈', color: (data?.netIncome||0) >= 0 ? '#10B981' : '#EF4444' },
        ].map(c => (
          <div key={c.label} style={{ ...card, padding:'18px 20px', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ fontSize:32 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>{c.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color:c.color, letterSpacing:'-0.01em' }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div style={card}>
        <div style={{ padding:'18px 20px', borderBottom:'0.5px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ color:'white', fontSize:15, fontWeight:600 }}>📋 Order Terbaru</div>
            <div style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginTop:2 }}>8 order terbaru masuk</div>
          </div>
          <Link to="/admin/orders" style={{ fontSize:12, color:'#93B4FC', border:'0.5px solid rgba(29,78,216,0.3)', padding:'6px 12px', borderRadius:8, background:'rgba(29,78,216,0.1)' }}>
            Lihat semua →
          </Link>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'0.5px solid rgba(255,255,255,0.05)' }}>
                {['Kode Order','Pelanggan','Layanan','Total','Status','Pembayaran'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders||[]).map(o => (
                <tr key={o.id} style={{ borderBottom:'0.5px solid rgba(255,255,255,0.04)', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', fontSize:12, color:'#93B4FC', fontWeight:600, whiteSpace:'nowrap' }}>{o.order_code}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ fontSize:13, color:'white', fontWeight:500 }}>{o.Customer?.User?.name||'—'}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{o.Customer?.User?.phone||''}</div>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:12, color:'rgba(255,255,255,0.45)', maxWidth:180 }}>
                    {o.OrderItems?.map(i=>i.Service?.name).join(', ')||'—'}
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:'white', fontWeight:600, whiteSpace:'nowrap' }}>
                    Rp {Number(o.total_amount||0).toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ fontSize:11, padding:'4px 10px', borderRadius:20, background:statusBg[o.status] || 'rgba(255,255,255,0.05)', color:statusColor[o.status] || '#fff', fontWeight:500, whiteSpace:'nowrap' }}>
                      {statusLabel[o.status] || o.status}
                    </span>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ fontSize:11, padding:'4px 10px', borderRadius:20, background:o.payment_status==='paid'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)', color:o.payment_status==='paid'?'#10B981':'#F59E0B', fontWeight:500 }}>
                      {o.payment_status==='paid'?'✓ Lunas':'Belum bayar'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.recentOrders?.length && (
            <div style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
              <div style={{ color:'rgba(255,255,255,0.25)', fontSize:13 }}>Belum ada order masuk</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}