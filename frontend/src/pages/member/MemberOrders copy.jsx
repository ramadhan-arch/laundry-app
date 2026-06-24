// Pages Member: LaundryKu
// Dikerjakan oleh: Ukhti Zahra Isyana
// NIM: 2410501130
// Tanggal: 17 Juni 2026

import { useEffect, useState } from 'react';
import MemberNavbar from '../../components/member/MemberNavbar';
import { useOrder } from '../../context/OrderContext';

const statusLabel = { pending:'Menunggu Proses', processing:'Sedang Diproses', washing:'Sedang Dicuci', drying:'Dikeringkan', ironing:'Disetrika', done:'Selesai', delivered:'Sudah Dikirim', cancelled:'Dibatalkan' };
const statusColor = { pending:'#D97706', processing:'#2563EB', washing:'#2563EB', drying:'#2563EB', ironing:'#7C3AED', done:'#16A34A', delivered:'#16A34A', cancelled:'#DC2626' };
const statusBg = { pending:'#FEF3C7', processing:'#DBEAFE', washing:'#DBEAFE', drying:'#DBEAFE', ironing:'#EDE9FE', done:'#DCFCE7', delivered:'#DCFCE7', cancelled:'#FEE2E2' };
const statusIcon = { pending:'⏳', processing:'⚙️', washing:'🫧', drying:'💨', ironing:'👔', done:'✅', delivered:'🚚', cancelled:'❌' };
const statusSteps = ['pending','processing','washing','drying','ironing','done'];

export default function MemberOrders() {
  const { myOrders, loading, fetchMyOrders, invalidateOrders } = useOrder();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchMyOrders(); }, []);

  const handleRefresh = () => { invalidateOrders(); fetchMyOrders(true); };

  const tabs = [
    { key:'all', label:'Semua', count:myOrders.length },
    { key:'active', label:'Aktif', count:myOrders.filter(o=>!['done','delivered','cancelled'].includes(o.status)).length },
    { key:'done', label:'Selesai', count:myOrders.filter(o=>['done','delivered'].includes(o.status)).length },
    { key:'unpaid', label:'Belum Bayar', count:myOrders.filter(o=>o.payment_status==='unpaid'&&o.status!=='cancelled').length },
  ];

  const filtered = myOrders.filter(o => {
    if (filter==='active') return !['done','delivered','cancelled'].includes(o.status);
    if (filter==='done') return ['done','delivered'].includes(o.status);
    if (filter==='unpaid') return o.payment_status==='unpaid' && o.status!=='cancelled';
    return true;
  });

  return (
    <div style={{ background:'#F8F7F4', minHeight:'100vh', fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <MemberNavbar />
      <div style={{ maxWidth:760, margin:'0 auto', padding:'32px 24px' }}>

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#1a1a1a', letterSpacing:'-0.02em' }}>Order Saya</h1>
            <p style={{ fontSize:13, color:'#9CA3AF', marginTop:3 }}>Pantau status cucian kamu di sini</p>
          </div>
          <button onClick={handleRefresh}
            style={{ fontSize:13, color:'#1D4ED8', background:'#EFF6FF', border:'0.5px solid #BFDBFE', borderRadius:10, padding:'8px 16px', cursor:'pointer', fontWeight:500 }}>
            🔄 Refresh
          </button>
        </div>

        {/* TABS */}
        <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              style={{ padding:'8px 16px', borderRadius:20, border:'0.5px solid', fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:6, transition:'all 0.15s',
                borderColor:filter===t.key?'#1D4ED8':'rgba(0,0,0,0.1)',
                background:filter===t.key?'#1D4ED8':'#fff',
                color:filter===t.key?'#fff':'#6B6B6B' }}>
              {t.label}
              {t.count > 0 && (
                <span style={{ fontSize:11, background:filter===t.key?'rgba(255,255,255,0.25)':'rgba(0,0,0,0.08)', padding:'1px 7px', borderRadius:10, fontWeight:700 }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <div className="spin" style={{ borderTopColor:'#1D4ED8', borderColor:'rgba(29,78,216,0.15)' }} />
            <p style={{ marginTop:12, fontSize:13, color:'#9CA3AF' }}>Memuat order...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <div style={{ fontSize:56, marginBottom:14 }}>🧺</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#1a1a1a', marginBottom:6 }}>Belum ada order</div>
            <div style={{ fontSize:14, color:'#9CA3AF' }}>Hubungi admin untuk membuat order laundry</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {filtered.map(o => (
              <div key={o.id} onClick={() => setSelected(selected?.id===o.id?null:o)}
                style={{ background:'#fff', border:`0.5px solid ${selected?.id===o.id?'#1D4ED8':'rgba(0,0,0,0.07)'}`, borderRadius:18, overflow:'hidden', cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e => { if(selected?.id!==o.id) e.currentTarget.style.borderColor='#93C5FD'; }}
                onMouseLeave={e => { if(selected?.id!==o.id) e.currentTarget.style.borderColor='rgba(0,0,0,0.07)'; }}>

                {/* STATUS COLOR BAR */}
                <div style={{ height:4, background:statusColor[o.status] }} />

                <div style={{ padding:20 }}>
                  {/* HEADER */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:46, height:46, borderRadius:14, background:statusBg[o.status], display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
                        {statusIcon[o.status]}
                      </div>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:'#1a1a1a' }}>{o.order_code}</div>
                        <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>
                          {new Date(o.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <span style={{ fontSize:12, padding:'5px 12px', borderRadius:20, background:statusBg[o.status], color:statusColor[o.status], fontWeight:700, display:'block', marginBottom:5 }}>
                        {statusLabel[o.status]}
                      </span>
                      <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:o.payment_status==='paid'?'#DCFCE7':'#FEF3C7', color:o.payment_status==='paid'?'#16A34A':'#D97706', fontWeight:600 }}>
                        {o.payment_status==='paid'?'✓ Lunas':'Belum Bayar'}
                      </span>
                    </div>
                  </div>

                  {/* LAYANAN */}
                  <div style={{ fontSize:13, color:'#6B6B6B', marginBottom:14, padding:'10px 14px', background:'#F8F7F4', borderRadius:10 }}>
                    🧺 {o.OrderItems?.map(i=>`${i.Service?.name} (${i.quantity} ${i.Service?.unit})`).join(' · ')}
                  </div>

                  {/* PROGRESS BAR */}
                  {!['cancelled','delivered'].includes(o.status) && (
                    <div style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', gap:3, marginBottom:6 }}>
                        {statusSteps.map((s,idx) => {
                          const cur = statusSteps.indexOf(o.status);
                          const active = idx <= cur;
                          const isCur = idx === cur;
                          return (
                            <div key={s} style={{ flex:1, height:6, borderRadius:3, background:active?statusColor[o.status]:'#E5E7EB', transition:'all 0.4s', position:'relative', overflow:'hidden' }}>
                              {isCur && <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.3)', animation:'pulse 1.5s infinite' }} />}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#9CA3AF' }}>
                        <span>Mulai: {o.order_date}</span>
                        <span>Estimasi selesai: {o.estimated_done||'—'}</span>
                      </div>
                    </div>
                  )}

                  {/* FOOTER */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'0.5px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize:12, color:'#9CA3AF' }}>{selected?.id===o.id?'▲ Tutup detail':'▼ Lihat detail'}</div>
                    <div style={{ fontSize:18, fontWeight:800, color:'#1D4ED8' }}>Rp {Number(o.total_amount).toLocaleString('id-ID')}</div>
                  </div>

                  {/* DETAIL EXPAND */}
                  {selected?.id === o.id && (
                    <div style={{ marginTop:16, paddingTop:16, borderTop:'0.5px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:12 }}>Rincian item:</div>
                      {o.OrderItems?.map(i => (
                        <div key={i.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13, marginBottom:8, padding:'10px 14px', background:'#F8F7F4', borderRadius:10 }}>
                          <div>
                            <span style={{ color:'#1a1a1a', fontWeight:500 }}>{i.Service?.name}</span>
                            <span style={{ color:'#9CA3AF', marginLeft:8 }}>× {i.quantity} {i.Service?.unit}</span>
                          </div>
                          <span style={{ color:'#1D4ED8', fontWeight:700 }}>Rp {Number(i.subtotal).toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                      {o.Employee && (
                        <div style={{ fontSize:13, color:'#6B6B6B', marginTop:10, padding:'10px 14px', background:'#EFF6FF', borderRadius:10 }}>
                          👨‍💼 Karyawan: <strong>{o.Employee.name}</strong> ({o.Employee.position})
                        </div>
                      )}
                      {o.notes && (
                        <div style={{ marginTop:8, padding:'10px 14px', background:'#FEF3C7', borderRadius:10, fontSize:13, color:'#92400E' }}>
                          📝 Catatan: {o.notes}
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
